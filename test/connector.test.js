import assert from 'node:assert/strict'
import test from 'node:test'
import { apply, inject } from '../index.js'

test('uses native OAuth and registers the workspace when Host UI services are available', () => {
  let entry
  let workspace
  const ctx = {
    mcpManager: {
      startAuthorization() {},
      register: (server, config) => { entry = { server, config } },
    },
    inject: (services, activate) => {
      assert.deepEqual(services, ['typert', 'tools'])
      activate(ctx)
    },
    provide: (name, service) => { workspace = { name, service } },
    typert: { register() {} },
  }
  apply(ctx)

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
  assert.equal(workspace.name, 'octerAdsWorkspace')
  assert.equal(typeof workspace.service.request, 'function')
})

test('keeps native MCP available in profiles without workspace services', () => {
  const registered = []
  apply({
    mcpManager: { startAuthorization() {}, register: server => registered.push(server) },
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
      if (services.includes('typert')) return
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
