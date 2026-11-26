import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import test from 'node:test'
import { createOAuthClient, resource } from '../legacy-oauth.js'
import { createLegacyAccount } from '../legacy.js'

test('authorizes with PKCE, restores and refreshes the grant, and clears it on disconnect', async () => {
  let registered
  let challenge
  let tokenRequests = 0
  let saved
  let access
  let denyRefresh = false
  const credentials = {
    async modifyRecord(_key, change) {
      saved = (await change(saved)) ?? saved
      return saved
    },
    async deleteRecord() { saved = undefined },
    async set(_key, value) { access = value },
    async unset() { access = undefined },
  }
  const oauth = createOAuthClient(async (url, request) => {
    if (url.endsWith('/oauth-authorization-server')) {
      return Response.json({
        issuer: 'https://ads-mcp.octer.ai',
        registration_endpoint: 'https://octer.ai/api/ads-mcp/register',
        authorization_endpoint: 'https://octer.ai/api/ads-mcp/authorize',
        token_endpoint: 'https://octer.ai/api/ads-mcp/token',
        code_challenge_methods_supported: ['S256'],
        scopes_supported: ['google_ads:read', 'openai_ads:read'],
      })
    }
    if (url.endsWith('/register')) {
      registered = JSON.parse(request.body)
      assert.equal(registered.token_endpoint_auth_method, 'none')
      assert.match(registered.redirect_uris[0], /^http:\/\/127\.0\.0\.1:\d+\/mcp\/oauth\/callback\/[a-f0-9]{64}$/)
      return Response.json({ ...registered, client_id: 'test-client' }, { status: 201 })
    }
    assert.match(url, /\/token$/)
    tokenRequests++
    assert.equal(request.body.get('client_id'), 'test-client')
    assert.equal(request.body.get('resource'), resource)
    if (request.body.get('grant_type') === 'authorization_code') {
      assert.equal(request.body.get('code'), 'test-code')
      assert.equal(request.body.get('redirect_uri'), registered.redirect_uris[0])
      assert.equal(createHash('sha256').update(request.body.get('code_verifier')).digest('base64url'), challenge)
    } else {
      assert.equal(request.body.get('grant_type'), 'refresh_token')
      assert.equal(request.body.get('refresh_token'), 'refresh-' + (tokenRequests - 1))
      if (denyRefresh) return Response.json({ error: 'invalid_grant' }, { status: 400 })
    }
    return Response.json({
      token_type: 'Bearer', access_token: 'access-' + tokenRequests,
      refresh_token: 'refresh-' + tokenRequests, expires_in: 900,
    })
  })

  let account = createLegacyAccount(credentials, oauth)
  try {
    const link = await account.connect(new AbortController().signal)
    assert.equal(await account.connect(new AbortController().signal), link)
    const redirect = await fetch(link, { redirect: 'manual' })
    assert.equal(redirect.status, 302)
    const authorize = new URL(redirect.headers.get('location'))
    assert.equal(authorize.origin, 'https://octer.ai')
    assert.equal(authorize.searchParams.get('code_challenge_method'), 'S256')
    assert.equal(authorize.searchParams.get('scope'), 'google_ads:read openai_ads:read')
    challenge = authorize.searchParams.get('code_challenge')
    const callback = new URL(authorize.searchParams.get('redirect_uri'))
    callback.searchParams.set('state', 'incorrect')
    callback.searchParams.set('code', 'test-code')
    assert.equal((await fetch(callback)).status, 400)
    assert.equal(tokenRequests, 0)

    callback.searchParams.set('state', authorize.searchParams.get('state'))
    const completed = await fetch(callback)
    assert.equal(completed.status, 200)
    assert.doesNotMatch(await completed.text(), /access-1|refresh-1|test-code/)
    assert.equal(access, 'access-1')
    assert.equal(saved.payload.refresh, 'refresh-1')
    await account.dispose()

    account = createLegacyAccount(credentials, oauth)
    assert.equal(await account.sync(), true)
    assert.equal(tokenRequests, 1)
    saved.payload.expiresAt = Date.now() - 1000
    assert.equal(await account.sync(), true)
    assert.equal(access, 'access-2')
    assert.equal(saved.payload.refresh, 'refresh-2')

    saved.payload.expiresAt = Date.now() - 1000
    denyRefresh = true
    assert.equal(await account.sync(), false)
    assert.equal(access, undefined)
    assert.equal(saved, undefined)

    const unusedLink = await account.connect(new AbortController().signal)
    await account.disconnect()
    await assert.rejects(fetch(unusedLink))
    assert.equal(access, undefined)
    assert.equal(saved, undefined)
  } finally {
    await account.dispose()
  }
})
