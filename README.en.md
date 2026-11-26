# OCTER Ads for DeepSeek Harness

![OCTER Ads · Free-forever ad management and reporting](https://repository-images.githubusercontent.com/1473021794/550f5915-9107-4c6d-bd86-06d9b51c43b9)

[中文](README.md)

**Free-forever ad management and optimization.** OCTER Ads supports GPT Ads, Google Ads, Meta Ads, Microsoft Ads, Amazon Ads, and TikTok Ads. OCTER checks account and API permissions. Ad platforms bill for ad spend. [OCTER Ads](https://ads-mcp.octer.ai/)

## What you get

| Where | What you can do |
| --- | --- |
| **Plugin details** | Authorize OCTER, link ad accounts, and check read or write access |
| **OCTER Ads sidebar** | Filter campaign performance by platform, account, and date |
| **Chat** | See spend, impressions, clicks, and conversions in charts and tables |
| **Report preferences** | Save your default platform, account, and date range |

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
- “Chart the last seven days of Google Ads spend, clicks, and conversions.”
