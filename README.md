# OCTER Ads for DeepSeek Harness

永久免费的广告管理和优化插件。OCTER Ads 支持 GPT Ads、Google Ads、Meta Ads、Microsoft Ads、Amazon Ads 和 TikTok Ads。可分析已连接广告账号的花费、点击和转化，生成投放报表。广告操作受 OCTER 的 API 权限控制，实际投放费用由广告平台结算。

A free-forever ad management and optimization plugin. OCTER Ads supports GPT Ads, Google Ads, Meta Ads, Microsoft Ads, Amazon Ads, and TikTok Ads. Analyze spend, clicks, and conversions for your connected accounts and generate performance reports. OCTER enforces your API permissions. Ad platforms bill for ad spend.

## 安装与授权 / Install and connect

OCTER Ads **0.2.0** 支持 DeepSeek Harness **0.2.2-rc.5** 和 **0.2.3-alpha.2**。桌面版可在「插件 → 添加插件」粘贴本仓库的 GitHub 地址。已通过版本豁免安装 0.1.0 的用户，请更新到 0.2.0。

OCTER Ads **0.2.0** supports DeepSeek Harness **0.2.2-rc.5** and **0.2.3-alpha.2**. On Desktop, paste this repository's GitHub URL in **Plugins → Add plugin**. If you installed 0.1.0 with a version exemption, update to 0.2.0.

```sh
dsh plugin --profile web add github:octer-ai/octer-ads-dsh
dsh --profile web
```

### 连接 OCTER / Connect OCTER

- **Harness 0.2.2-rc.5**：在对话里输入「连接 OCTER Ads」，用同一台电脑的浏览器打开授权链接。授权后回到 Harness 输入 `ads`。输入「断开 OCTER Ads」可清除 Harness 中保存的授权。
- **Harness 0.2.3-alpha.2**：在「插件」中打开 **OCTER Ads**，点击「连接 OCTER Ads」并在浏览器完成授权。可在同一页面退出。

- **Harness 0.2.2-rc.5** — type “Connect OCTER Ads” in chat and open the authorization link in a browser on the same computer. Return to Harness and enter `ads`. Say “Disconnect OCTER Ads” to clear the saved authorization.
- **Harness 0.2.3-alpha.2** — open **OCTER Ads** in Plugins and select **Connect OCTER Ads** to authorize it in your browser. You can sign out on the same page.

如果还没有绑定广告账号，请到 [OCTER Ads](https://ads-mcp.octer.ai/) 绑定。插件的 MCP 服务器名称为 `ads`。如果曾手动添加同名服务器，请先在设置中移除同名条目，保留其余配置。

If you need to link ad accounts, visit [OCTER Ads](https://ads-mcp.octer.ai/). The plugin registers the MCP server as `ads`. If you already added a server with that name manually, remove that entry in Settings before enabling the plugin.

## 绑定 GPT Ads / Connect GPT Ads

### 中文步骤

1. 连接 OCTER Ads 后，在 Harness 输入「帮我绑定 GPT Ads 账号」并打开助手返回的 OCTER 绑定链接。
2. 从 GPT Ads Manager 获取 Advertiser API Key，仅在 OCTER 的绑定页面填写并验证。
3. 回到 Harness 输入 `ads`，确认 GPT Ads 已绑定。

### English steps

1. After connecting OCTER Ads, enter “Help me connect my GPT Ads account” in Harness and open the OCTER link returned by the assistant.
2. Get your Advertiser API Key from GPT Ads Manager and enter it on the OCTER account connection page.
3. Return to Harness and enter `ads` to confirm that GPT Ads is connected.

### 更多绑定示例 / More connection prompts

| 中文 | English |
| --- | --- |
| 帮我绑定 Google Ads 账号，给我 OCTER 的绑定链接。 | Help me connect my Google Ads account and give me the OCTER connection link. |
| 帮我连接 Meta Ads，告诉我在哪里完成授权。 | Help me connect Meta Ads and tell me where to authorize access. |
| 我想绑定 Microsoft Ads，帮我打开绑定流程。 | I want to connect Microsoft Ads. Help me start the connection process. |
| 我已授权 GPT Ads，帮我检查是否绑定成功。 | I've authorized GPT Ads. Check whether the account is connected. |

## 使用示例 / Example prompts

输入 `ads` 可查看已绑定的广告平台。也可以直接复制下面的示例到 Harness。

Enter `ads` to see which ad platforms are connected, or paste one of the prompts below into Harness.

### 中文示例

- 帮我绑定 GPT Ads 账号，给我 OCTER 的绑定链接。
- 列出我已连接的 GPT Ads 账号及其广告系列。
- 将最近 7 天 Google Ads 的花费、点击和转化整理成投放报表，并用折线图展示每日趋势。
- 比较 Meta Ads 最近 7 天和前 7 天的投放效果，按广告系列列出花费、点击和转化的变化。
- 汇总最近 30 天 Microsoft Ads 的投放表现，用表格展示广告系列明细，用柱状图对比花费和转化。

### English examples

- Help me connect my GPT Ads account and give me the OCTER connection link.
- List my connected GPT Ads accounts and their campaigns.
- Create a Google Ads report for the last 7 days with daily line charts for spend, clicks, and conversions.
- Compare the last 7 days of Meta Ads performance with the previous 7 days. Show changes in spend, clicks, and conversions by campaign.
- Summarize the last 30 days of Microsoft Ads performance with a campaign table and bar charts for spend and conversions.

可用平台和操作取决于当前 OCTER 账号的绑定状态和授权。

Available platforms and actions depend on your connected accounts and permissions in OCTER.
