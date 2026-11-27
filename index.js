import { bindingClientHeaders } from './binding.js'
import { registerLegacyConnector } from './legacy.js'
import { resource } from './legacy-oauth.js'
import { registerWorkspace } from './workspace.js'

export const name = 'octer-ads'
export const inject = ['mcpManager']

export function apply(ctx) {
  if (typeof ctx.mcpManager.startAuthorization !== 'function') {
    ctx.inject(['credentials', 'tools', 'systemPrompt'], scope => {
      const account = registerLegacyConnector(scope)
      scope.inject(['typert'], host => registerWorkspace(host, account))
    })
    return
  }

  ctx.mcpManager.register('ads', {
    transport: 'streamable-http',
    url: resource,
    headers: bindingClientHeaders,
    oauth: { credentialKey: 'mcp-client/octer-ads' },
    toolLoading: 'eager',
  })
  ctx.inject(['typert', 'tools'], registerWorkspace)
}
