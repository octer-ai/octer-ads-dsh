# OCTER Ads for DeepSeek Harness

永久免费的广告管理和优化插件。分析已连接广告账号的花费、点击和转化，生成投放报表。广告操作受 OCTER 的 API 权限控制，实际投放费用由广告平台结算。

Free-forever ad management and optimization. Analyze spend, clicks, and conversions for your connected accounts and generate performance reports. OCTER enforces your API permissions. Ad platforms bill for ad spend.

## 安装与授权 / Install and connect

需要 DeepSeek Harness **0.2.3-alpha.2** 或兼容的更新版本。

Requires DeepSeek Harness **0.2.3-alpha.2** or a compatible newer version.

```sh
dsh plugin --profile web add github:octer-ai/octer-ads-dsh
dsh --profile web
```

使用兼容版本的桌面客户端时，可在「插件」中搜索并安装 `github:octer-ai/octer-ads-dsh`。

In a compatible Desktop client, search for and install `github:octer-ai/octer-ads-dsh` in Plugins.

在「插件」中打开 **OCTER Ads**，点击「连接 OCTER Ads」并在浏览器完成授权。如果还没有绑定广告账号，请到 [OCTER Ads](https://ads-mcp.octer.ai/) 绑定。插件的 MCP 服务器名称为 `ads`。如果曾手动添加同名服务器，请先在设置中移除同名条目，保留其余配置。

Open **OCTER Ads** in Plugins, select **Connect OCTER Ads**, and authorize it in your browser. If you need to link ad accounts, visit [OCTER Ads](https://ads-mcp.octer.ai/). The plugin registers the MCP server as `ads`. If you already added a server with that name manually, remove that entry in Settings before enabling the plugin.

## 使用示例 / Example prompts

- `ads`
- 将最近 7 天 Google Ads 的花费、点击和转化整理成投放报表，并用图表展示趋势。
- Show my Microsoft Ads campaign performance for the last 30 days, with a chart for spend and conversions.

在「插件」的 **OCTER Ads** 页面退出可清除 Harness 中保存的授权。可用平台和操作取决于当前 OCTER 账号的绑定状态和授权。

Sign out on the **OCTER Ads** plugin page to clear the grant stored in Harness. Available platforms and actions depend on your connected accounts and permissions in OCTER.
