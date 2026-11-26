export const labels = {
  openai_ads: 'GPT Ads', google_ads: 'Google Ads', meta_ads: 'Meta Ads',
  microsoft_ads: 'Microsoft Ads', amazon_ads: 'Amazon Ads', tiktok_ads: 'TikTok Ads',
}

export const metrics = [
  ['spend', '花费'], ['impressions', '展示'], ['clicks', '点击'], ['conversions', '转化'],
]

export function dateRange(days, timezone) {
  let date
  try {
    date = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date())
  } catch {
    date = new Date().toISOString().slice(0, 10)
  }
  const start = new Date(Date.parse(date) - (days - 1) * 86_400_000).toISOString().slice(0, 10)
  return { start, end: date }
}

function accumulate(target, row) {
  for (const [key] of metrics) {
    const value = row[key]
    if (value == null || value === '' || !Number.isFinite(Number(value))) continue
    target[key] = (target[key] ?? 0) + Number(value)
  }
}

export function summarize(rows) {
  const total = {}
  const days = new Map()
  const campaigns = new Map()
  for (const row of rows) {
    accumulate(total, row)
    if (row.date) {
      if (!days.has(row.date)) days.set(row.date, { date: row.date })
      accumulate(days.get(row.date), row)
    }
    if (row.campaign_id) {
      if (!campaigns.has(row.campaign_id)) {
        campaigns.set(row.campaign_id, { id: row.campaign_id, name: row.campaign_name || row.campaign_id })
      }
      accumulate(campaigns.get(row.campaign_id), row)
    }
  }
  return {
    total,
    days: [...days.values()].sort((a, b) => a.date.localeCompare(b.date)),
    campaigns: [...campaigns.values()].sort((a, b) => (b.spend ?? 0) - (a.spend ?? 0)),
  }
}

export function fromToolContent(block) {
  const content = block?.content ?? []
  for (const item of content) {
    if (item.type !== 'text' || !item.text?.trim().startsWith('{')) continue
    try {
      const parsed = JSON.parse(item.text)
      if (Array.isArray(parsed.rows) || parsed.state === 'processing') return parsed
    } catch {
      // Some content blocks have explanatory text instead of the report payload.
    }
  }
  return null
}

export function formatMetric(value, key, currency) {
  if (value == null) return '—'
  if (key === 'spend' && /^[A-Z]{3}$/.test(currency ?? '')) {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value)
  }
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value)
}
