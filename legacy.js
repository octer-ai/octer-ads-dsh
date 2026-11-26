import { createOAuthClient, GrantRejected, resource } from './legacy-oauth.js'

const accessKey = 'OCTER_ADS_DSH_LEGACY_ACCESS_TOKEN'
const grantKey = 'octer-ads/legacy-oauth'
const refreshLeadMs = 60_000
const retryMs = 20_000

export function createLegacyAccount(credentials, oauth = createOAuthClient()) {
  const lifetime = new AbortController()
  let current
  let timer
  let previous = Promise.resolve()

  function serial(work) {
    const next = previous.then(work)
    previous = next.catch(() => {})
    return next
  }

  function schedule(delay) {
    clearTimeout(timer)
    if (lifetime.signal.aborted) return
    timer = setTimeout(() => void sync(), delay)
    timer.unref()
  }

  async function publish(grant) {
    await credentials.set(accessKey, grant.access)
    schedule(Math.max(1_000, grant.expiresAt - Date.now() - refreshLeadMs))
  }

  function sync() {
    return serial(async () => {
      let grant
      try {
        lifetime.signal.throwIfAborted()
        const record = await credentials.modifyRecord(grantKey, async (stored) => {
          grant = stored?.payload
          if (!grant || grant.expiresAt - Date.now() > refreshLeadMs) return undefined
          const updated = await oauth.refresh(grant, lifetime.signal)
          return { kind: 'octer-ads-oauth', payload: updated }
        })
        grant = record?.payload ?? grant
        if (!grant || grant.expiresAt <= Date.now()) {
          await credentials.unset(accessKey)
          return false
        }
        await publish(grant)
        return true
      } catch (error) {
        if (lifetime.signal.aborted) return false
        if (error instanceof GrantRejected) {
          await credentials.unset(accessKey)
          await credentials.deleteRecord(grantKey)
          return false
        }
        if (grant && grant.expiresAt <= Date.now()) await credentials.unset(accessKey)
        schedule(retryMs)
        return false
      }
    }).catch(() => {
      schedule(retryMs)
      return false
    })
  }

  async function connect(signal) {
    lifetime.signal.throwIfAborted()
    signal.throwIfAborted()
    if (current) return current.link
    const attempt = new AbortController()
    const cancel = () => attempt.abort()
    const finish = () => {
      if (current?.attempt === attempt) current = undefined
    }
    signal.addEventListener('abort', cancel, { once: true })
    const link = oauth.open(AbortSignal.any([lifetime.signal, attempt.signal]), grant =>
      serial(async () => {
        lifetime.signal.throwIfAborted()
        attempt.signal.throwIfAborted()
        await credentials.modifyRecord(grantKey, async () => ({ kind: 'octer-ads-oauth', payload: grant }))
        await publish(grant)
      }), finish)
    current = { attempt, link }
    try {
      return await link
    } catch {
      finish()
      throw new Error('Could not start OCTER Ads authorization. Please try connecting again.')
    } finally {
      signal.removeEventListener('abort', cancel)
    }
  }

  function disconnect() {
    current?.attempt.abort()
    current = undefined
    return serial(async () => {
      clearTimeout(timer)
      await credentials.unset(accessKey)
      await credentials.deleteRecord(grantKey)
    })
  }

  return {
    connect, disconnect, sync,
    pending: () => current !== undefined,
    dispose() {
      lifetime.abort()
      clearTimeout(timer)
      return previous
    },
  }
}

function registerTextTool(ctx, name, description, execute) {
  ctx.effect(() => ctx.tools.register({
    name, description,
    parameters: { type: 'object', properties: {}, additionalProperties: false },
    output: {
      schema: { type: 'string' },
      render: (_args, text) => [{ type: 'text', text }],
    },
    execute: (_args, { signal }) => execute(signal),
  }), name)
}

export function registerLegacyConnector(ctx) {
  const account = createLegacyAccount(ctx.credentials)
  ctx.effect(() => () => account.dispose(), 'OCTER Ads legacy OAuth')
  void account.sync()

  ctx.mcpManager.register('ads', {
    transport: 'streamable-http',
    url: resource,
    headers: { Authorization: 'Bearer ${credential:' + accessKey + '}' },
    toolLoading: 'eager',
  })

  registerTextTool(ctx, 'octer_ads_connect', 'Start OCTER Ads account authorization when the user asks to connect OCTER Ads. Show the returned link as a clickable link for the user to open in their browser.', async signal => {
    const link = await account.connect(signal)
    return '请在当前电脑的浏览器打开 [授权 OCTER Ads](' + link + ')。授权完成后回到 Harness 输入 `ads`。'
  })
  registerTextTool(ctx, 'octer_ads_connection_status', 'Check local OCTER Ads authorization when the user asks about connection status or says ads and no OCTER Ads MCP tools are available.', async () => {
    if (account.pending()) return 'OCTER Ads 正在等待浏览器授权。完成后请再次输入 ads。'
    if (await account.sync()) return 'OCTER 授权已保存。请调用 MCP 的 list_platforms 检查已绑定的广告平台。若工具仍未出现，请稍后重试。'
    return '尚未连接 OCTER Ads。请输入「连接 OCTER Ads」开始浏览器授权。'
  })
  registerTextTool(ctx, 'octer_ads_disconnect', 'Clear local OCTER Ads authorization only when the user explicitly asks to disconnect or sign out of OCTER Ads.', async () => {
    await account.disconnect()
    return '已清除当前 Harness 的 OCTER Ads 授权。OCTER 中的广告账号仍保持绑定。'
  })

  ctx.effect(() => ctx.systemPrompt.section({
    name: 'octer-ads-legacy',
    order: ctx.systemPrompt.getSectionOrder('MCP_SERVERS'),
    text: 'For explicit requests to connect OCTER Ads, call octer_ads_connect and show its exact browser link. For requests to bind a specific ad platform, use OCTER Ads MCP when available. When the entire user message is ads, use the OCTER Ads MCP list_platforms tool if available, or octer_ads_connection_status otherwise.',
  }), 'OCTER Ads legacy guidance')
}
