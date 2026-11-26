const name = 'octerAdsWorkspace'
const packageName = 'octer-ads-dsh'
const json = { mode: 'src-json' }
const readTools = new Set(['list_platforms', 'list_accounts', 'get_performance', 'get_microsoft_ads_report', 'get_amazon_report', 'connect_platform'])

const platforms = new Set(['google_ads', 'openai_ads', 'meta_ads', 'microsoft_ads', 'amazon_ads', 'tiktok_ads'])
const toolErrors = {
  provider_not_configured: '该平台尚未绑定，或当前连接缺少读取权限。请检查 OCTER 中的平台绑定。',
  provider_permission_denied: '当前连接无权读取此广告账号。请在 OCTER 检查账号授权。',
  provider_authentication_failed: '当前授权未通过验证。请在账号连接中重新授权。',
  provider_resource_not_found: '广告平台未找到所选账号或报表。请确认账号后重试。',
  provider_rate_limited: '广告平台暂时限制查询频率，请稍后重试。',
  provider_unavailable: '广告平台暂时无法返回数据，请稍后重试。',
  invalid_date_range: '请选择 1 至 31 天的报表周期。',
  invalid_parameter: '查询参数无效，请检查所选账号和日期后重试。',
  invalid_provider_response: '广告平台返回的数据格式异常，请稍后重试。',
  report_expired: '报表已过期，请重新查询。',
  report_failed: '广告平台未能生成报表，请重新查询。',
}

function toolFailure(message = '') {
  const code = message.match(/\b(provider_[a-z_]+|invalid_[a-z_]+|report_expired|report_failed):/)?.[1]
  if (code && Object.hasOwn(toolErrors, code)) return new Error(toolErrors[code])
  if (/timed out|timeout|ETIMEDOUT/i.test(message)) return new Error('OCTER 查询超时，请稍后重试。')
  return new Error('OCTER 暂时无法完成请求，请稍后重试。')
}

function checked(value, max = 512) {
  if (typeof value !== 'string' || !value || value.length > max) throw new Error('请求参数无效。')
  return value
}

function platformKey(value) {
  if (!platforms.has(value)) throw new Error('广告平台无效。')
  return value
}

function period(start, end) {
  for (const day of [start, end]) {
    if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isFinite(Date.parse(day))
      || new Date(day).toISOString().slice(0, 10) !== day) throw new Error('请选择有效日期。')
  }
  const diff = (Date.parse(end) - Date.parse(start)) / 86_400_000
  if (diff < 0 || diff >= 31) throw new Error('请选择 1 至 31 天的报表周期。')
}

function trustedLink(value, purpose) {
  if (!value) return null
  const url = new URL(value)
  if (url.username || url.password) throw new Error('OCTER 返回了无效的授权链接。')
  if (purpose === 'legacy' && url.protocol === 'http:' && url.hostname === '127.0.0.1'
    && url.port && /^\/connect\/[a-f0-9]{64}$/.test(url.pathname)) return url.href
  if (url.protocol === 'https:' && ['octer.ai', 'ads-mcp.octer.ai'].includes(url.hostname) && !url.port) return url.href
  throw new Error('OCTER 返回了无效的授权链接。')
}

export function extractMcp(result) {
  if (result?.isError) {
    const messages = result.content?.filter(item => item.type === 'text').map(item => item.text) ?? []
    throw toolFailure(messages.join('\n'))
  }
  if (result?.structuredContent && typeof result.structuredContent === 'object') return result.structuredContent
  for (const item of result?.content ?? []) {
    if (item.type !== 'text' || typeof item.text !== 'string' || !/^[\[{]/.test(item.text.trim())) continue
    try {
      const value = JSON.parse(item.text)
      if (value && typeof value === 'object') return value
    } catch {
      // Other MCP content blocks may contain a human-readable report.
    }
  }
  throw new Error('OCTER 没有返回可用的报表数据。')
}

async function callMcp(ctx, operation, args, signal) {
  if (!readTools.has(operation)) throw new Error('不支持此操作。')
  const tool = ctx.tools.get('mcp__ads__' + operation)
  if (!tool) throw new Error('当前连接未提供此功能，请检查 OCTER 账号权限。')
  let result
  try {
    result = await tool.execute(args, { signal })
  } catch (error) {
    signal.throwIfAborted()
    throw toolFailure(error instanceof Error ? error.message : '')
  }
  return extractMcp(result)
}

export function registerWorkspace(ctx, legacy) {
  let authUrl = null
  const read = (operation, args, signal) => callMcp(ctx, operation, args, signal)
  const service = {
    async request(input, signal) {
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('请求无效。')
      switch (input.action) {
        case 'status': {
          const instance = ctx.mcpManager.list().find(server => server.name === 'ads')
          const state = instance?.status?.state ?? 'closed'
          if (legacy && !legacy.pending()) authUrl = null
          return {
            state,
            pending: legacy ? legacy.pending() : ['starting', 'waiting-browser', 'exchanging', 'committing'].includes(instance?.authorization?.phase),
            authUrl: legacy ? authUrl : trustedLink(instance?.authorization?.authorizationUrl, 'native'),
          }
        }
        case 'authorize': {
          if (legacy) authUrl = trustedLink(await legacy.connect(signal), 'legacy')
          else {
            const attempt = await ctx.mcpManager.startAuthorization('ads')
            authUrl = trustedLink(attempt?.authorizationUrl, 'native')
          }
          return { authUrl }
        }
        case 'disconnect':
          if (legacy) await legacy.disconnect()
          else await ctx.mcpManager.signOut('ads')
          authUrl = null
          return null
        case 'platforms': {
          const data = await read('list_platforms', {}, signal)
          return Array.isArray(data) ? data : data.result ?? []
        }
        case 'bind': {
          const data = await read('connect_platform', { platform: platformKey(input.platform) }, signal)
          return { url: trustedLink(data.url, 'binding') }
        }
        case 'accounts': {
          const args = { platform: platformKey(input.platform), limit: 50 }
          if (input.cursor) args.cursor = checked(input.cursor, 4096)
          return read('list_accounts', args, signal)
        }
        case 'report': {
          const platform = platformKey(input.platform)
          period(input.start, input.end)
          const args = { platform, account_id: checked(input.account), start_date: input.start, end_date: input.end, limit: 100 }
          if (input.cursor) args.cursor = checked(input.cursor, 4096)
          if (input.reportId) {
            const refresh = platform === 'microsoft_ads' ? 'get_microsoft_ads_report'
              : platform === 'amazon_ads' ? 'get_amazon_report' : null
            if (!refresh) throw new Error('当前平台无需通过报表编号查询。')
            return read(refresh, {
              account_id: args.account_id, report_id: checked(input.reportId, 4096), limit: args.limit,
              ...(args.cursor ? { cursor: args.cursor } : {}),
            }, signal)
          }
          return read('get_performance', args, signal)
        }
        default:
          throw new Error('不支持此操作。')
      }
    },
  }
  service.typertRemote = { service, serviceKey: name, namespace: name }
  ctx.provide(name, service)
  ctx.typert.register({
    package: packageName,
    face: 'host',
    schemas: [],
    invocations: [{
      id: packageName + '/workspace',
      service: name, namespace: name, method: 'request',
      invocation: { kind: 'direct' },
      parameters: [{ name: 'input', wire: 'input', source: 'json', codec: json }],
      cancellation: { parameter: 'signal' },
      result: json,
    }],
  })
}
