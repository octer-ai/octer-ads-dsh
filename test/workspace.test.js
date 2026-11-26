import assert from 'node:assert/strict'
import test from 'node:test'
import { fromToolContent, summarize } from '../ui/report.js'
import { extractMcp, registerWorkspace } from '../workspace.js'

test('aggregates structured report rows and preserves unavailable metrics', () => {
  const rows = [
    { date: '2026-11-22', campaign_id: '1', campaign_name: 'Search', spend: '18.20', clicks: 19, conversions: null },
    { date: '2026-11-21', campaign_id: '1', campaign_name: 'Search', spend: '1.80', clicks: 2, conversions: null },
    { date: '2026-11-22', campaign_id: '2', campaign_name: 'Brand', spend: 0, clicks: 1, conversions: 0 },
  ]
  const payload = { rows }
  assert.deepEqual(fromToolContent({ content: [
    { type: 'text', text: '# Report' },
    { type: 'text', text: JSON.stringify(payload) },
  ] }), payload)
  assert.deepEqual(summarize(rows), {
    total: { spend: 20, clicks: 22, conversions: 0 },
    days: [
      { date: '2026-11-21', spend: 1.8, clicks: 2 },
      { date: '2026-11-22', spend: 18.2, clicks: 20, conversions: 0 },
    ],
    campaigns: [
      { id: '1', name: 'Search', spend: 20, clicks: 21 },
      { id: '2', name: 'Brand', spend: 0, clicks: 1, conversions: 0 },
    ],
  })
})

test('dashboard routes a paginated report through read-only MCP tools and rejects invalid requests', async () => {
  let rpc
  const calls = []
  registerWorkspace({
    provide: (_key, service) => { rpc = service },
    typert: { register() {} },
    tools: {
      get: tool => ({
        async execute(args) {
          calls.push({ tool, args })
          return { structuredContent: { rows: [], state: 'ready' } }
        },
      }),
    },
  })
  const signal = new AbortController().signal
  const input = { action: 'report', platform: 'microsoft_ads', account: '123', start: '2026-11-20', end: '2026-11-22' }
  await rpc.request(input, signal)
  await rpc.request({ ...input, reportId: 'example', cursor: 'next' }, signal)
  assert.deepEqual(calls.map(call => call.tool), ['mcp__ads__get_performance', 'mcp__ads__get_microsoft_ads_report'])
  assert.equal(calls[1].args.cursor, 'next')
  await assert.rejects(rpc.request({ ...input, start: '2026-11-31' }, signal))
  await assert.rejects(rpc.request({ ...input, action: 'write_campaign' }, signal))
  assert.equal(calls.length, 2)
})

test('dashboard distinguishes query failures from permission errors and empty reports', async () => {
  let rpc
  let failure
  registerWorkspace({
    provide: (_key, service) => { rpc = service },
    typert: { register() {} },
    tools: {
      get: () => ({ async execute() { throw new Error(failure) } }),
    },
  })
  const signal = new AbortController().signal
  const report = { action: 'report', platform: 'google_ads', account: '1234567890', start: '2026-11-01', end: '2026-11-26' }
  failure = 'Tool execution failed: provider_permission_denied: private upstream details'
  await assert.rejects(rpc.request(report, signal), { message: '当前连接无权读取此广告账号。请在 OCTER 检查账号授权。' })
  failure = 'MCP error -32001: Request timed out'
  await assert.rejects(rpc.request(report, signal), { message: 'OCTER 查询超时，请稍后重试。' })

  const empty = { rows: [], state: 'ready' }
  assert.equal(extractMcp({ structuredContent: empty }), empty)
  assert.throws(() => extractMcp({ content: [] }), { message: 'OCTER 没有返回可用的报表数据。' })
  assert.throws(() => extractMcp({ isError: true, content: [{ type: 'text', text: 'provider_rate_limited: details' }] }),
    { message: '广告平台暂时限制查询频率，请稍后重试。' })
})
