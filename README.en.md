# OCTER Ads for DeepSeek Harness

![OCTER Ads · Free-forever ad management and reporting](https://repository-images.githubusercontent.com/1473021794/550f5915-9107-4c6d-bd86-06d9b51c43b9)

[中文](README.md)

**A free-forever ad management and optimization plugin.** Connect ad accounts, build performance reports, and plan campaign improvements in DeepSeek Harness. Account connections, data queries, and reporting are free. Each ad platform bills for its own ad spend. [OCTER Ads](https://ads-mcp.octer.ai/)

## What you get

| Where | What you can do |
| --- | --- |
| **Plugin details** | Authorize OCTER, link ad accounts, and check each platform’s connection status and permissions |
| **OCTER Ads sidebar** | Build reports by platform, account, and date, with spend, impressions, clicks, conversions, and campaign details |
| **Chat** | See performance in KPI cards, trend charts, and tables. Compare date ranges, spot campaigns with rising spend or falling conversions, and get optimization suggestions |
| **Report preferences** | Save your usual platform, account, and date range for repeat reviews |

### Supported ad platforms

OCTER Ads supports **GPT Ads, Google Ads, Meta Ads, Microsoft Ads, Amazon Ads, and TikTok Ads**. Connect an account to query the performance data the platform returns. Report dimensions, metrics, and available actions depend on the platform API and account permissions.

### API permission controls

The OCTER API checks permissions for each ad platform and account. **Read-only** access covers account details, campaigns, and reports. **Read/write** access also allows campaign management actions supported by the platform and authorized for the account. The API rejects unauthorized requests. Read-only access is enough to run reports and get optimization suggestions.

## Install

1. Open **Plugins → Add plugin** in Harness and paste `https://github.com/octer-ai/octer-ads-dsh`. Works with **0.2.2-rc.5** and **0.2.3-alpha.2**.
2. Open **OCTER Ads** in the sidebar and authorize OCTER in a browser on the same computer.
3. Link ad accounts in **OCTER**. For GPT Ads, enter your Advertiser API Key from GPT Ads Manager on the OCTER connection page.

```sh
dsh plugin --profile web add github:octer-ai/octer-ads-dsh
```

## Try in chat

- `ads` — check connected platforms.
- “Help me connect my GPT Ads account.”
- “Create a Google Ads weekly report with daily trends for spend, clicks, and conversions, plus a campaign breakdown.”
- “Compare the last two weeks of Meta Ads spend and conversions. Flag campaigns with rising spend and falling conversions, and suggest what to investigate first.”
- “Summarize the last 30 days of Amazon Ads spend and clicks by campaign, and highlight the highest-spending campaign.”
