import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { once } from 'node:events'
import { createServer } from 'node:http'

export const resource = 'https://ads-mcp.octer.ai/mcp'
const issuer = new URL(resource).origin
const metadataUrl = issuer + '/.well-known/oauth-authorization-server'
const oauthOrigins = new Set([issuer, 'https://octer.ai'])
const flowTimeoutMs = 10 * 60_000

export class GrantRejected extends Error {}

function endpoint(value) {
  const url = new URL(value)
  if (!oauthOrigins.has(url.origin) || url.username || url.password || url.hash) {
    throw new Error('Unexpected OCTER OAuth endpoint.')
  }
  return url.href
}

function matches(expected, value) {
  if (typeof value !== 'string' || value.length !== expected.length) return false
  const actual = Buffer.from(value, 'utf8')
  return actual.length === expected.length && timingSafeEqual(Buffer.from(expected), actual)
}

function page(response, status, message) {
  response.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  })
  response.end('<!doctype html><html><meta charset="utf-8"><title>OCTER Ads</title><p>' + message + '</p></html>')
}

export function createOAuthClient(fetchResponse = fetch) {
  async function request(url, signal, options = {}) {
    const response = await fetchResponse(url, {
      ...options,
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.any([signal, AbortSignal.timeout(12_000)]),
    })
    const body = await response.json()
    if (!response.ok) {
      if (body?.error === 'invalid_grant' || body?.error === 'invalid_client') {
        throw new GrantRejected('OCTER authorization has expired or was revoked.')
      }
      throw new Error('OCTER OAuth request failed (' + response.status + ').')
    }
    return body
  }

  async function discover(signal) {
    const metadata = await request(metadataUrl, signal)
    if (metadata.issuer !== issuer || !metadata.code_challenge_methods_supported?.includes('S256')) {
      throw new Error('Unexpected OCTER OAuth issuer or PKCE configuration.')
    }
    const scopes = metadata.scopes_supported
    if (!Array.isArray(scopes) || !scopes.length || !scopes.every(s => typeof s === 'string' && /^[a-z_]+:(read|write)$/.test(s))) {
      throw new Error('Unexpected OCTER OAuth scope configuration.')
    }
    return {
      registration: endpoint(metadata.registration_endpoint),
      authorization: endpoint(metadata.authorization_endpoint),
      token: endpoint(metadata.token_endpoint),
      scope: scopes.join(' '),
    }
  }

  async function exchange(tokenUrl, clientId, fields, signal) {
    const tokens = await request(endpoint(tokenUrl), signal, {
      method: 'POST',
      body: new URLSearchParams({ ...fields, client_id: clientId, resource }),
    })
    if (String(tokens.token_type).toLowerCase() !== 'bearer'
      || typeof tokens.access_token !== 'string' || !/^[A-Za-z0-9._~+\/-]+=*$/.test(tokens.access_token)
      || typeof tokens.refresh_token !== 'string' || !tokens.refresh_token
      || !Number.isFinite(tokens.expires_in) || tokens.expires_in <= 0) {
      throw new Error('Invalid OCTER OAuth token response.')
    }
    return {
      clientId, tokenUrl,
      access: tokens.access_token,
      refresh: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    }
  }

  async function open(signal, save, finish) {
    const metadata = await discover(signal)
    const nonce = randomBytes(32).toString('hex')
    const verifier = randomBytes(32).toString('base64url')
    const state = randomBytes(32).toString('base64url')
    const entryPath = '/connect/' + nonce
    const callbackPath = '/mcp/oauth/callback/' + nonce
    let origin
    let authorization
    let used = false
    const server = createServer(async (req, res) => {
      if (!origin || req.method !== 'GET' || req.headers.host !== new URL(origin).host
        || !req.url?.startsWith('/') || req.url.startsWith('//')) {
        return page(res, 404, 'OCTER Ads authorization page not found.')
      }
      const url = new URL(req.url, origin)
      if (url.pathname === entryPath && authorization && !used) {
        res.writeHead(302, { Location: authorization, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' })
        return res.end()
      }
      if (url.pathname !== callbackPath || used || url.searchParams.getAll('state').length !== 1
        || !matches(state, url.searchParams.get('state'))) {
        return page(res, 400, 'Invalid OCTER Ads authorization attempt.')
      }
      used = true
      try {
        if (url.searchParams.has('error')) {
          return page(res, 400, 'OCTER Ads authorization was declined. 授权未完成。')
        }
        const codes = url.searchParams.getAll('code')
        if (codes.length !== 1 || !codes[0]) {
          return page(res, 400, 'OCTER Ads authorization code is missing.')
        }
        const grant = await exchange(metadata.token, clientId, {
          grant_type: 'authorization_code', code: codes[0], redirect_uri: origin + callbackPath,
          code_verifier: verifier,
        }, signal)
        signal.throwIfAborted()
        await save(grant)
        page(res, 200, 'OCTER Ads connected. 授权成功。请回到 DeepSeek Harness 输入 ads。')
      } catch {
        page(res, 502, 'OCTER Ads could not complete authorization. 请回到 Harness 重新连接。')
      } finally {
        close()
        finish()
      }
    })
    let clientId
    let timer
    function close() {
      clearTimeout(timer)
      signal.removeEventListener('abort', close)
      server.close()
    }
    signal.addEventListener('abort', close, { once: true })
    try {
      signal.throwIfAborted()
      server.listen(0, '127.0.0.1')
      await once(server, 'listening', { signal })
      origin = 'http://127.0.0.1:' + server.address().port
      const redirectUri = origin + callbackPath
      const client = await request(metadata.registration, signal, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: 'DeepSeek Harness',
          redirect_uris: [redirectUri],
          token_endpoint_auth_method: 'none',
          grant_types: ['authorization_code', 'refresh_token'],
          response_types: ['code'],
        }),
      })
      if (typeof client.client_id !== 'string' || !client.client_id || !client.redirect_uris?.includes(redirectUri)) {
        throw new Error('Invalid OCTER OAuth client registration.')
      }
      clientId = client.client_id
      const url = new URL(metadata.authorization)
      for (const [key, value] of Object.entries({
        response_type: 'code', client_id: clientId, redirect_uri: redirectUri, resource, scope: metadata.scope,
        state, code_challenge_method: 'S256', code_challenge: createHash('sha256').update(verifier).digest('base64url'),
      })) {
        url.searchParams.set(key, value)
      }
      authorization = url.href
      timer = setTimeout(() => {
        close()
        finish()
      }, flowTimeoutMs)
      timer.unref()
      return origin + entryPath
    } catch (error) {
      close()
      throw error
    }
  }

  return {
    open,
    refresh: (grant, signal) => exchange(grant.tokenUrl, grant.clientId, {
      grant_type: 'refresh_token', refresh_token: grant.refresh,
    }, signal),
  }
}
