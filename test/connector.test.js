import assert from 'node:assert/strict'
import test from 'node:test'
import { apply, inject } from '../index.js'

test('registers the production server and the OAuth account under the same name', () => {
  let entry
  let account
  let dispose
  let unregistered = false
  const stop = () => {
    unregistered = true
  }

  apply({
    mcpManager: {
      startAuthorization() {},
      register: (server, config) => {
        entry = { server, config }
      },
    },
    inject: (services, activate) => {
      assert.deepEqual(services, ['mcpAccounts'])
      activate({
        effect: (register) => {
          dispose = register()
        },
        mcpAccounts: {
          register: (options) => {
            account = options
            return stop
          },
        },
      })
    },
  })

  assert.deepEqual(inject, ['mcpManager'])
  assert.deepEqual(entry, {
    server: 'ads',
    config: {
      transport: 'streamable-http',
      url: 'https://ads-mcp.octer.ai/mcp',
      oauth: { credentialKey: 'mcp-client/octer-ads' },
      toolLoading: 'eager',
    },
  })
  assert.equal(account.server, entry.server)
  assert.equal(account.packageName, 'octer-ads-dsh')
  assert.equal(account.copy.connect.en, 'Connect OCTER Ads')
  assert.equal(account.copy.connect.zh, '连接 OCTER Ads')
  dispose()
  assert.equal(unregistered, true)
})

test('keeps the MCP integration available without the Plugins page service', () => {
  const registered = []
  apply({
    mcpManager: { startAuthorization() {}, register: (server) => registered.push(server) },
    inject: () => {},
  })

  assert.deepEqual(registered, ['ads'])
})

test('registers the legacy transport without relying on native OAuth', () => {
  let server
  const tools = []
  const cleanup = []
  const ctx = {
    mcpManager: { register: (name, config) => { server = { name, config } } },
    credentials: { modifyRecord: async () => undefined, unset: async () => {} },
    tools: { register: ({ name }) => { tools.push(name) } },
    systemPrompt: { getSectionOrder: () => 0, section: () => {} },
    inject: (services, activate) => {
      assert.deepEqual(services, ['credentials', 'tools', 'systemPrompt'])
      activate(ctx)
    },
    effect: (activate) => cleanup.push(activate()),
  }
  apply(ctx)
  assert.deepEqual(server, {
    name: 'ads',
    config: {
      transport: 'streamable-http',
      url: 'https://ads-mcp.octer.ai/mcp',
      headers: { Authorization: 'Bearer ${credential:OCTER_ADS_DSH_LEGACY_ACCESS_TOKEN}' },
      toolLoading: 'eager',
    },
  })
  assert.deepEqual(tools, ['octer_ads_connect', 'octer_ads_connection_status', 'octer_ads_disconnect'])
  for (const dispose of cleanup) dispose?.()
})
