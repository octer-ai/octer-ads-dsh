import { registerLegacyConnector } from './legacy.js'
import { resource } from './legacy-oauth.js'

export const name = 'octer-ads'
export const inject = ['mcpManager']

const server = 'ads'
const packageName = 'octer-ads-dsh'

const copy = {
  title: { en: 'OCTER account', zh: 'OCTER 账号' },
  connect: { en: 'Connect OCTER Ads', zh: '连接 OCTER Ads' },
  activation: {
    title: { en: 'Connect your OCTER account', zh: '连接你的 OCTER 账号' },
    body: {
      en: 'Sign in to OCTER in your browser to use your connected ad accounts in DeepSeek Harness.',
      zh: '在浏览器登录 OCTER，即可在 DeepSeek Harness 中使用已绑定的广告账号。',
    },
  },
  detail: {
    disconnected: { en: 'Connect your OCTER account to get started.', zh: '连接 OCTER 账号后即可开始。' },
    waitingBrowser: { en: 'Complete authorization in your browser.', zh: '请在浏览器完成授权。' },
    authorizing: { en: 'Authorizing your OCTER account…', zh: '正在授权 OCTER 账号…' },
    connecting: { en: 'Connecting to OCTER Ads…', zh: '正在连接 OCTER Ads…' },
    connected: { en: 'Your OCTER account is connected.', zh: 'OCTER 账号已连接。' },
    rejected: { en: 'The OCTER grant is no longer valid. Connect again.', zh: 'OCTER 授权已失效，请重新连接。' },
    scope: { en: 'OCTER Ads needs additional permissions. Connect again.', zh: 'OCTER Ads 需要额外权限，请重新连接。' },
  },
  signOut: {
    title: { en: 'Sign out of OCTER Ads?', zh: '要退出 OCTER Ads 吗？' },
    body: {
      en: 'This clears the OCTER authorization saved in this Harness profile. Your ad accounts remain linked in OCTER.',
      zh: '这将清除当前 Harness 配置中保存的 OCTER 授权。广告账号仍绑定在 OCTER 中。',
    },
  },
  notice: {
    connected: { en: 'OCTER Ads connected.', zh: 'OCTER Ads 已连接。' },
    signedOut: { en: 'Signed out of OCTER Ads.', zh: '已退出 OCTER Ads。' },
  },
}
export function apply(ctx) {
  if (typeof ctx.mcpManager.startAuthorization !== 'function') {
    ctx.inject(['credentials', 'tools', 'systemPrompt'], registerLegacyConnector)
    return
  }

  ctx.mcpManager.register(server, {
    transport: 'streamable-http',
    url: resource,
    oauth: { credentialKey: 'mcp-client/octer-ads' },
    toolLoading: 'eager',
  })

  ctx.inject(['mcpAccounts'], (scope) => {
    scope.effect(
      () => scope.mcpAccounts.register({ server, packageName, copy }),
      'OCTER Ads account',
    )
  })
}
