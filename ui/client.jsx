import React, { useCallback, useEffect, useState } from 'react'
import { dateRange, formatMetric, fromToolContent, labels, metrics, summarize } from './report.js'
import { styles } from './styles.js'

const preferencesKey = 'octer-ads-dsh:preferences'
const bindingPage = 'https://octer.ai/workspace/ads-mcp/platforms'
const defaults = { platform: '', account: '', days: 7 }

function readPreferences() {
  try {
    const value = JSON.parse(window.localStorage.getItem(preferencesKey) ?? '{}')
    return {
      platform: labels[value.platform] ? value.platform : '',
      account: typeof value.account === 'string' ? value.account : '',
      days: [7, 14, 30].includes(value.days) ? value.days : defaults.days,
    }
  } catch {
    return defaults
  }
}

function useStatus(call) {
  const [status, setStatus] = useState(null)
  const [failure, setFailure] = useState('')
  const reload = useCallback(async signal => {
    try {
      const next = await call('status', {}, signal)
      if (!signal?.aborted) {
        setStatus(next)
        setFailure('')
      }
    } catch (error) {
      if (!signal?.aborted) setFailure(error.message)
    }
  }, [call])
  useEffect(() => {
    const abort = new AbortController()
    let timer
    async function poll() {
      await reload(abort.signal)
      if (!abort.signal.aborted) timer = setTimeout(poll, 2500)
    }
    void poll()
    return () => {
      abort.abort()
      clearTimeout(timer)
    }
  }, [reload])
  return { status, failure, reload }
}

function usePlatforms(call, connected) {
  const [platforms, setPlatforms] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    setError('')
    setPlatforms([])
    if (!connected) {
      setLoading(false)
      return
    }
    const abort = new AbortController()
    setLoading(true)
    call('platforms', {}, abort.signal).then(value => {
      if (!abort.signal.aborted) setPlatforms(Array.isArray(value) ? value : [])
    }, failure => {
      if (!abort.signal.aborted) setError(failure.message)
    }).finally(() => {
      if (!abort.signal.aborted) setLoading(false)
    })
    return () => abort.abort()
  }, [call, connected, attempt])
  return { platforms, error, loading, refresh: () => setAttempt(value => value + 1) }
}

function useAccounts(call, platform) {
  const [state, setState] = useState({ platform: '', accounts: [], error: '', loading: false })
  useEffect(() => {
    if (!platform) {
      setState({ platform, accounts: [], error: '', loading: false })
      return
    }
    const abort = new AbortController()
    setState({ platform, accounts: [], error: '', loading: true })
    void (async () => {
      const accounts = []
      let cursor
      for (let page = 0; page < 20; page++) {
        const data = await call('accounts', { platform, cursor }, abort.signal)
        accounts.push(...(data.accounts ?? []))
        cursor = data.next_cursor
        if (!cursor) break
      }
      if (!abort.signal.aborted) setState({
        platform, accounts: accounts.filter(account => !account.is_manager), error: '', loading: false,
        partial: Boolean(cursor),
      })
    })().catch(error => {
      if (!abort.signal.aborted) setState({ platform, accounts: [], error: error.message, loading: false })
    })
    return () => abort.abort()
  }, [call, platform])
  return state.platform === platform ? state : { accounts: [], error: '', loading: Boolean(platform) }
}

function Permissions({ platform }) {
  const coverage = platform?.coverage ?? ''
  if (!platform?.configured) return <span className="oads-muted">—</span>
  if (/read\s*\/\s*write|读写/i.test(coverage)) return <span className="oads-pill">读写</span>
  if (/read(?:-only| access)|只读/i.test(coverage)) return <span className="oads-pill">只读</span>
  return <span className="oads-muted">以 OCTER 授权为准</span>
}

function Connection({ call, status, failure, reload, inventory, openDashboard }) {
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [url, setUrl] = useState(null)
  const [platformLinks, setPlatformLinks] = useState({})
  const [confirmDisconnect, setConfirmDisconnect] = useState(false)
  const connected = status?.state === 'connected'

  useEffect(() => {
    if (connected || !status?.pending) setUrl(null)
    if (!connected) setPlatformLinks({})
  }, [connected, status?.pending])

  async function perform(action, input, completed) {
    setNotice('')
    setBusy(true)
    try {
      const data = await call(action, input)
      completed?.(data)
      await reload()
    } catch (error) {
      setNotice(error.message)
    } finally {
      setBusy(false)
    }
  }

  const activeUrl = url ?? status?.authUrl
  return <section className="oads-panel" aria-label="账号连接">
    <div className="oads-heading">
      <div><h2>账号连接</h2><p>通过浏览器授权 OCTER，查看广告平台绑定和访问权限。</p></div>
      <span className={'oads-pill' + (connected ? ' oads-ready' : '')}>
        {connected ? '已连接' : status?.pending ? '等待授权' : ['connecting', 'reconnecting'].includes(status?.state)
          ? '连接中' : status ? '未连接' : '检测中'}
      </span>
    </div>
    <div className="oads-actions">
      {activeUrl && !connected
        ? <a className="oads-primary" href={activeUrl} target="_blank" rel="noopener noreferrer">在浏览器授权</a>
        : <button className={connected ? '' : 'oads-primary'} disabled={busy || status?.pending}
          onClick={() => void perform('authorize', {}, data => setUrl(data.authUrl))}>
          {connected ? '重新授权' : '连接 OCTER'}
        </button>}
      {activeUrl && connected && <a href={activeUrl} target="_blank" rel="noopener noreferrer">继续浏览器授权</a>}
      {(connected || status?.pending) && <button disabled={busy} onClick={() => setConfirmDisconnect(true)}>断开连接</button>}
      {connected && <a href={bindingPage} target="_blank" rel="noopener noreferrer">在 OCTER 管理广告账号 ↗</a>}
      {openDashboard && <button onClick={openDashboard}>打开投放看板</button>}
    </div>
    {confirmDisconnect && <div className="oads-confirm">
      <p>清除当前 Harness 中保存的授权。广告账号仍绑定在 OCTER。</p>
      <button disabled={busy} onClick={() => void perform('disconnect', {}, () => {
        setConfirmDisconnect(false)
        setUrl(null)
      })}>确认断开</button>
      <button onClick={() => setConfirmDisconnect(false)}>取消</button>
    </div>}
    {(notice || failure || inventory.error) && <p role="alert" className="oads-error">{notice || failure || inventory.error}</p>}
    {connected && <div className="oads-platforms">
      <div className="oads-heading">
        <h3>广告平台</h3>
        <button onClick={inventory.refresh} disabled={inventory.loading || busy}>{inventory.loading ? '刷新中…' : '刷新绑定状态'}</button>
      </div>
      <ul>
        {Object.entries(labels).map(([key, label]) => {
          const item = inventory.platforms.find(platform => platform.platform === key)
          return <li key={key}>
            <strong>{label}</strong>
            <span>{item?.configured ? '已绑定' : item ? '未绑定' : inventory.loading ? '检测中' : '未返回状态'}</span>
            <Permissions platform={item}/>
            {platformLinks[key] ? <a href={platformLinks[key]} target="_blank" rel="noopener noreferrer">继续绑定 ↗</a>
              : item && !item.configured && <button disabled={busy}
                onClick={() => void perform('bind', { platform: key }, ({ url: link }) => {
                  setPlatformLinks(links => ({ ...links, [key]: link || bindingPage }))
                })}>绑定</button>}
          </li>
        })}
      </ul>
    </div>}
  </section>
}

function SelectAccount({ accounts, account, onChange, loading }) {
  return <label>广告账号<select value={account} disabled={loading || !accounts.length} onChange={event => onChange(event.target.value)}>
    <option value="">{loading ? '加载中…' : '选择账号'}</option>
    {accounts.map(item => <option key={item.id} value={item.id}>{item.name || item.id}{item.currency ? ' · ' + item.currency : ''}</option>)}
  </select></label>
}

function Settings({ call, platforms, preferences, onSave }) {
  const [draft, setDraft] = useState(preferences)
  const [notice, setNotice] = useState('')
  const result = useAccounts(call, platforms.some(row => row.platform === draft.platform) ? draft.platform : '')

  function save() {
    if (draft.account && !result.accounts.some(account => account.id === draft.account)) {
      setNotice('请选择当前可访问的默认账号。')
      return
    }
    try {
      window.localStorage.setItem(preferencesKey, JSON.stringify(draft))
      onSave(draft)
      setNotice('已保存。')
    } catch {
      setNotice('保存失败，请检查 Harness 的本地存储。')
    }
  }

  return <section className="oads-panel" aria-label="报表偏好">
    <div className="oads-heading"><div><h2>报表偏好</h2><p>保存当前客户端打开看板时默认使用的账号和日期范围。</p></div></div>
    <div className="oads-form">
      <label>默认平台<select value={draft.platform} onChange={event => setDraft({ ...draft, platform: event.target.value, account: '' })}>
        <option value="">自动选择</option>
        {platforms.map(row => <option key={row.platform} value={row.platform}>{labels[row.platform]}</option>)}
      </select></label>
      <SelectAccount accounts={result.accounts} account={draft.account} loading={result.loading}
        onChange={account => setDraft({ ...draft, account })}/>
      <label>默认周期<select value={draft.days} onChange={event => setDraft({ ...draft, days: Number(event.target.value) })}>
        {[7, 14, 30].map(days => <option value={days} key={days}>最近 {days} 天</option>)}
      </select></label>
    </div>
    <div className="oads-actions"><button disabled={result.loading} onClick={save}>保存默认设置</button>
      <span role="status">{notice}</span></div>
    {result.error && <p role="alert" className="oads-error">{result.error}</p>}
  </section>
}

function Report({ data }) {
  const [metric, setMetric] = useState('spend')
  if (data.state === 'processing') return <p role="status">平台正在生成报表。</p>
  const { total, days, campaigns } = summarize(data.rows ?? [])
  const account = data.account ?? {}
  const currency = account.currency || ''
  const times = days.filter(day => day[metric] != null)
  const max = Math.max(1, ...times.map(day => day[metric]))
  return <article className="oads-report" aria-label="投放报表">
    <div className="oads-heading"><div><h3>{labels[account.platform] || '广告平台'}投放报表</h3>
      <p>{[account.name || account.id, data.start_date && data.end_date && data.start_date + ' 至 ' + data.end_date,
        currency, account.timezone].filter(Boolean).join(' · ')}</p></div></div>
    {(data.partial || data.next_cursor) && <p className="oads-warn">当前报表仅包含已读取的明细，汇总可能不完整。</p>}
    <div className="oads-totals">{metrics.map(([key, label]) => <div key={key}><span>{label}</span>
      <strong>{formatMetric(total[key], key, currency)}</strong></div>)}</div>
    {days.length ? <>
      <div className="oads-heading oads-trend"><h4>每日表现</h4><label>指标 <select value={metric} onChange={event => setMetric(event.target.value)}>
        {metrics.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </select></label></div>
      {times.length ? <div className="oads-chart-scroll"><div className="oads-chart" role="img"
        aria-label={'每日' + metrics.find(([key]) => key === metric)[1] + '柱状图'}>
        {days.map(day => <div key={day.date} className="oads-bar-item" title={day.date + ' · ' + formatMetric(day[metric], metric, currency)}>
          <div className="oads-bar-track">{day[metric] > 0 && <span className="oads-bar"
            style={{ height: Math.max(2, Math.min(100, day[metric] / max * 100)) + '%' }}/>}</div>
          <span>{day.date.slice(5)}</span>
        </div>)}
      </div></div> : <p className="oads-muted">所选周期没有返回该指标。</p>}
    </> : <p className="oads-muted">所选日期内没有返回投放数据。</p>}
    {campaigns.length > 0 && <details open={campaigns.length < 12}>
      <summary>广告系列明细 · {campaigns.length}</summary>
      <div className="oads-table"><table><thead><tr><th scope="col">广告系列</th>{metrics.map(([key, label]) => <th scope="col" key={key}>{label}</th>)}</tr></thead>
        <tbody>{campaigns.map(row => <tr key={row.id}><th scope="row">{row.name}</th>
          {metrics.map(([key]) => <td key={key}>{formatMetric(row[key], key, currency)}</td>)}</tr>)}</tbody>
      </table></div>
    </details>}
    {data.conversion_definition && <p className="oads-muted">{data.conversion_definition}</p>}
  </article>
}

function Dashboard({ call, platforms, preferences }) {
  const [platformChoice, setPlatform] = useState('')
  const [accountChoice, setAccount] = useState('')
  const [dates, setDates] = useState(null)
  const [output, setOutput] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const platform = platforms.find(item => item.platform === (platformChoice || preferences.platform))?.platform
    || platforms[0]?.platform || ''
  const info = useAccounts(call, platform)
  const account = info.accounts.find(item => item.id === (accountChoice || preferences.account)) ?? info.accounts[0]
  const { start, end } = dates ?? dateRange(preferences.days, platform === 'microsoft_ads' ? 'UTC' : account?.timezone)
  const reportKey = JSON.stringify([platform, account?.id, start, end])
  const current = output?.key === reportKey ? output.data : null

  async function run(range, reportId) {
    if (!account || loading || !range.start || !range.end) return
    setLoading(true)
    setError('')
    setOutput(null)
    const key = JSON.stringify([platform, account.id, range.start, range.end])
    try {
      let cursor
      const rows = []
      for (let page = 0; page < 20; page++) {
        const data = await call('report', { platform, account: account.id, ...range, reportId, cursor })
        rows.push(...(data.rows ?? []))
        cursor = data.next_cursor
        if (!cursor || data.state === 'processing' || page === 19) {
          setOutput({ key, data: { ...data, rows, partial: Boolean(cursor) } })
          break
        }
        reportId = data.report_id || reportId
      }
    } catch (failure) {
      setError(failure.message)
    } finally {
      setLoading(false)
    }
  }

  return <section className="oads-panel" aria-label="投放数据">
    <div className="oads-heading">
      <div><h2>投放数据</h2><p>查看单个账号的花费、展示、点击和转化。</p></div>
      <Permissions platform={platforms.find(item => item.platform === platform)}/>
    </div>
    {!!platforms.length && <form onSubmit={event => { event.preventDefault(); void run({ start, end }) }}>
      <div className="oads-form">
        <label>平台<select value={platform} disabled={loading} onChange={event => { setPlatform(event.target.value); setAccount(''); setDates(null) }}>
          {platforms.map(item => <option key={item.platform} value={item.platform}>{labels[item.platform]}</option>)}
        </select></label>
        <SelectAccount accounts={info.accounts} account={account?.id ?? ''} loading={info.loading || loading}
          onChange={value => { setAccount(value); setDates(null) }}/>
        <label>开始日期<input required type="date" value={start} max={end} disabled={loading} onChange={event => setDates({ start: event.target.value, end })}/></label>
        <label>结束日期<input required type="date" value={end} min={start} disabled={loading} onChange={event => setDates({ start, end: event.target.value })}/></label>
      </div>
      <div className="oads-actions"><button type="submit" className="oads-primary" disabled={!account || loading || !start || !end}>
        {loading ? '查询中…' : '查看投放报表'}</button>
        <button type="button" disabled={!account || loading} onClick={() => {
          const range = dateRange(7, platform === 'microsoft_ads' ? 'UTC' : account.timezone)
          setDates(range)
          void run(range)
        }}>最近 7 天</button>
        {current?.state === 'processing' && current.report_id && <button type="button" disabled={loading}
          onClick={() => void run({ start, end }, current.report_id)}>刷新报表进度</button>}
      </div>
    </form>}
    {!platforms.length && <p className="oads-muted">连接 OCTER 并绑定广告账号后，即可查看投放报表。</p>}
    {info.partial && <p className="oads-warn">账号列表仅包含已读取的账号。</p>}
    {(error || info.error) && <p role="alert" className="oads-error">{error || info.error}</p>}
    {current && <Report data={current}/>}
  </section>
}

function Workspace({ call, full, openDashboard }) {
  const [preferences, setPreferences] = useState(readPreferences)
  const status = useStatus(call)
  const connected = status.status?.state === 'connected'
  const data = usePlatforms(call, connected)
  const available = data.platforms.filter(item => item.configured && labels[item.platform])
  return <div className={'oads ' + (full ? 'oads-workspace' : '')}>
    <style>{styles}</style>
    {full && <header className="oads-hero"><p>OCTER Ads</p><h1>投放看板</h1>
      <span>查询投放效果、优化广告投放，操作权限由 OCTER 控制。</span></header>}
    {full && <Dashboard call={call} platforms={available} preferences={preferences}/>}
    <Connection call={call} {...status} inventory={data} openDashboard={openDashboard}/>
    <Settings call={call} platforms={available} preferences={preferences} onSave={setPreferences}/>
  </div>
}

function ToolReport({ phase, block, inspect }) {
  if (phase !== 'result') return <div className="oads"><style>{styles}</style><p className="oads-muted">正在查询投放报表…</p></div>
  const payload = fromToolContent(block)
  return <div className="oads"><style>{styles}</style>
    {payload && !block.isError ? <Report data={payload}/> : <p className="oads-muted">{
      block.content?.find(item => item.type === 'text')?.text || '本次工具调用未返回可绘制的报表。'
    }</p>}
    {inspect && <button type="button" onClick={inspect}>查看调用详情</button>}
  </div>
}

export const name = 'octer-ads-client'
export const inject = ['slots', 'connection', 'layout']

export function apply(ctx) {
  const call = async (action, fields, signal) => {
    const input = Object.fromEntries(Object.entries({ action, ...fields }).filter(([, value]) => value !== undefined))
    const response = await ctx.connection.rpc.call('/api', 'octerAdsWorkspace/request', { args: { input } }, signal)
    if (!response.ok) throw new Error(response.error?.message ?? '暂时无法访问 OCTER Ads。')
    return response.value
  }
  const add = (slot, placement, Component) => ctx.slots.inject(slot, () => ctx.slots.register({ name: slot, ...placement }, Component))
  add('plugins.bundle.config', { key: 'octer-ads-dsh' }, () => <Workspace call={call} full={false}
    openDashboard={() => ctx.layout.selectPanel('octer-ads')}/>)
  add('main', { key: 'octer-ads' }, () => <Workspace call={call} full/>)
  add('sidebar.panellist', { id: 'octer-ads', label: 'OCTER Ads', order: 55 }, () => <span aria-hidden="true">▥</span>)
  for (const tool of ['get_performance', 'get_microsoft_ads_report', 'get_amazon_report']) {
    add('tool.call.toolview', { key: 'mcp__ads__' + tool }, ToolReport)
  }
}
