import assert from 'node:assert/strict'
import test from 'node:test'
import { fromToolContent, summarize } from '../ui/report.js'
import { registerWorkspace } from '../workspace.js'

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
