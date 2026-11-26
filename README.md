# OCTER Ads · DeepSeek Harness 插件

![OCTER Ads · 永久免费 · 广告效果、投放优化与 API 权限控制](https://repository-images.githubusercontent.com/1473021794/550f5915-9107-4c6d-bd86-06d9b51c43b9)

[English](README.en.md)

**永久免费的广告管理和优化插件。** 支持 GPT Ads、Google Ads、Meta Ads、Microsoft Ads、Amazon Ads 和 TikTok Ads。实际投放费用由各平台结算，账号和操作权限由 OCTER API 校验。 [OCTER Ads 官网](https://ads-mcp.octer.ai/)

## 装好后能做什么

| 入口 | 功能 |
| --- | --- |
| **插件详情** | 授权 OCTER、绑定广告账号、查看平台状态和读写权限 |
| **左侧栏 OCTER Ads** | 按平台、账号和日期查看花费、展示、点击、转化及广告系列明细 |
| **对话** | 直接查询投放，结果以指标卡、图表和表格展示 |
| **报表偏好** | 保存默认平台、账号和查询周期 |

## 安装

1. 在 DeepSeek Harness 打开「插件 → 添加插件」，粘贴 `https://github.com/octer-ai/octer-ads-dsh`。兼容 **0.2.2-rc.5** 和 **0.2.3-alpha.2**。
2. 打开左侧栏 **OCTER Ads**，点击「连接 OCTER」，在同一台电脑的浏览器完成授权。
3. 在 **OCTER** 绑定广告账号。GPT Ads 需要在 OCTER 绑定页填写 GPT Ads Manager 的 Advertiser API Key。

Web 版也可以用 CLI 安装：

```sh
dsh plugin --profile web add github:octer-ai/octer-ads-dsh
```

## 对话示例

- `ads` — 查看已绑定的平台。
- 「帮我绑定 GPT Ads」或「帮我连接 Google Ads、Meta Ads 和 Microsoft Ads」。
- 「用图表展示最近 7 天 Google Ads 的花费、点击和转化。」
- 「比较 Meta Ads 最近两周的效果，按广告系列列出变化。」
