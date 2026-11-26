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
    mcpManager: { register: (server) => registered.push(server) },
    inject: () => {},
  })

  assert.deepEqual(registered, ['ads'])
})
