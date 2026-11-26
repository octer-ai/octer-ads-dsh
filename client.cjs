window.__ModuleLoader__.load({ id: "octer-ads-dsh", factory: function(require) {
const module = { exports: {} };
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ui/client.jsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(client_exports);
var import_react = __toESM(require("react"), 1);

// ui/report.js
var labels = {
  openai_ads: "GPT Ads",
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
  microsoft_ads: "Microsoft Ads",
  amazon_ads: "Amazon Ads",
  tiktok_ads: "TikTok Ads"
};
var metrics = [
  ["spend", "\u82B1\u8D39"],
  ["impressions", "\u5C55\u793A"],
  ["clicks", "\u70B9\u51FB"],
  ["conversions", "\u8F6C\u5316"]
];
function dateRange(days, timezone) {
  let date;
  try {
    date = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(/* @__PURE__ */ new Date());
  } catch {
    date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  }
  const start = new Date(Date.parse(date) - (days - 1) * 864e5).toISOString().slice(0, 10);
  return { start, end: date };
}
function accumulate(target, row) {
  for (const [key] of metrics) {
    const value = row[key];
    if (value == null || value === "" || !Number.isFinite(Number(value))) continue;
    target[key] = (target[key] ?? 0) + Number(value);
  }
}
function summarize(rows) {
  const total = {};
  const days = /* @__PURE__ */ new Map();
  const campaigns = /* @__PURE__ */ new Map();
  for (const row of rows) {
    accumulate(total, row);
    if (row.date) {
      if (!days.has(row.date)) days.set(row.date, { date: row.date });
      accumulate(days.get(row.date), row);
    }
    if (row.campaign_id) {
      if (!campaigns.has(row.campaign_id)) {
        campaigns.set(row.campaign_id, { id: row.campaign_id, name: row.campaign_name || row.campaign_id });
      }
      accumulate(campaigns.get(row.campaign_id), row);
    }
  }
  return {
    total,
    days: [...days.values()].sort((a, b) => a.date.localeCompare(b.date)),
    campaigns: [...campaigns.values()].sort((a, b) => (b.spend ?? 0) - (a.spend ?? 0))
  };
}
function fromToolContent(block) {
  const content = block?.content ?? [];
  for (const item of content) {
    if (item.type !== "text" || !item.text?.trim().startsWith("{")) continue;
    try {
      const parsed = JSON.parse(item.text);
      if (Array.isArray(parsed.rows) || parsed.state === "processing") return parsed;
    } catch {
    }
  }
  return null;
}
function formatMetric(value, key, currency) {
  if (value == null) return "\u2014";
  if (key === "spend" && /^[A-Z]{3}$/.test(currency ?? "")) {
    return new Intl.NumberFormat(void 0, { style: "currency", currency }).format(value);
  }
  return new Intl.NumberFormat(void 0, { maximumFractionDigits: 2 }).format(value);
}

// ui/styles.js
var styles = `
.oads, .oads * { box-sizing: border-box; }
.oads {
  --oads-text: var(--dsw-alias-label-primary, #ded8d2);
  --oads-muted: var(--dsw-alias-label-secondary, #a59a93);
  --oads-border: var(--dsw-alias-border-l2, #514743);
  --oads-panel: var(--dsw-alias-bg-module-platform, #262321);
  --oads-accent: #f47f6b;
  color: var(--oads-text);
  display: grid;
  align-content: start;
  gap: 14px;
  min-width: 0;
  font-size: 14px;
}
.oads-workspace {
  height: 100%;
  overflow: auto;
  padding: clamp(20px, 5vw, 52px);
  gap: 22px;
}
.oads-workspace > * { width: min(100%, 1080px); margin-inline: auto; }
.oads-hero {
  border-radius: 20px;
  padding: clamp(20px, 4vw, 40px);
  background: radial-gradient(ellipse at 80% 130%, #463030 0%, transparent 64%), #1a1716;
  border: 1px solid #6d4a46;
  color: #fff5ed;
}
.oads-hero p { color: #ffb9a6; font-weight: 700; }
.oads h1 { margin: 5px 0 10px; font-size: clamp(27px, 4vw, 40px); font-weight: 740; }
.oads h2, .oads h3, .oads h4 { margin: 0; font-weight: 680; }
.oads h2 { font-size: 20px; }
.oads h3 { font-size: 16px; }
.oads h4 { font-size: 14px; }
.oads p { margin: 6px 0; line-height: 1.5; }
.oads-heading { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.oads-heading p, .oads-muted { color: var(--oads-muted); }
.oads-panel, .oads-report {
  background: var(--oads-panel);
  border: 1px solid var(--oads-border);
  border-radius: 14px;
  padding: clamp(14px, 2.5vw, 22px);
}
.oads-report { margin-top: 14px; }
.oads button, .oads select, .oads input, .oads .oads-primary {
  appearance: auto;
  background: transparent;
  color: inherit;
  font: inherit;
  border: 1px solid var(--oads-border);
  border-radius: 8px;
  min-height: 34px;
  padding: 6px 10px;
}
.oads button, .oads a { cursor: pointer; }
.oads a { color: inherit; text-underline-offset: 3px; }
.oads button:disabled { opacity: .53; cursor: default; }
.oads button:hover:not(:disabled) { border-color: var(--oads-accent); }
.oads .oads-primary { background: var(--oads-accent); color: #241616; font-weight: 670; text-decoration: none; }
.oads-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; margin: 12px 0 0; }
.oads-pill {
  width: fit-content;
  white-space: nowrap;
  border-radius: 999px;
  border: 1px solid var(--oads-border);
  padding: 3px 9px;
  font-size: 12px;
}
.oads-ready { color: var(--dsw-alias-state-success-primary, #55b992); }
.oads-error { color: var(--dsw-alias-state-error-primary, #e66f61); }
.oads-warn { color: var(--dsw-alias-state-warning-primary, #c98c39); }
.oads-platforms { margin-top: 18px; }
.oads-platforms ul { padding: 0; margin: 8px 0 0; list-style: none; }
.oads-platforms li {
  min-height: 42px;
  display: grid;
  grid-template-columns: minmax(95px, 1fr) minmax(55px, .8fr) minmax(45px, 1fr) auto;
  align-items: center;
  gap: 8px;
  border-top: 1px solid var(--oads-border);
  padding: 6px 0;
}
.oads-confirm { margin-top: 12px; border-left: 3px solid var(--oads-accent); padding-left: 10px; }
.oads-confirm button { margin-right: 8px; }
.oads-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 145px), 1fr)); gap: 10px; margin-top: 14px; }
.oads-form label { display: grid; min-width: 0; gap: 5px; }
.oads-form select, .oads-form input { width: 100%; min-width: 0; }
.oads-totals { display: grid; grid-template-columns: repeat(auto-fit, minmax(98px, 1fr)); gap: 8px; margin-top: 12px; }
.oads-totals > div { display: grid; gap: 3px; padding: 10px; border: 1px solid var(--oads-border); border-radius: 8px; }
.oads-totals strong { font-size: 20px; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.oads-trend { align-items: center; margin-top: 14px; }
.oads-chart-scroll, .oads-table { overflow: auto; }
.oads-chart { display: flex; padding: 12px 4px 8px; justify-content: space-between; gap: 4px; }
.oads-bar-item { flex: 1 0 27px; display: grid; justify-items: center; gap: 5px; font-size: 10px; color: var(--oads-muted); }
.oads-bar-track { display: flex; align-items: flex-end; justify-content: center; height: 75px; width: 100%; border-bottom: 1px solid var(--oads-border); }
.oads-bar { display: block; width: min(80%, 28px); background: var(--oads-accent); border-radius: 3px 3px 0 0; }
.oads summary { cursor: pointer; margin: 12px 0 6px; }
.oads table { border-collapse: collapse; width: 100%; text-align: left; font-variant-numeric: tabular-nums; }
.oads th, .oads td { border-bottom: 1px solid var(--oads-border); padding: 7px; }
.oads th { font-weight: 630; }
@media (max-width: 480px) {
  .oads-platforms li { grid-template-columns: minmax(80px, 1fr) minmax(40px, auto) minmax(40px, auto); }
  .oads-platforms li > :nth-child(4) { grid-column: 1 / -1; justify-self: start; }
}
`;

// ui/client.jsx
var preferencesKey = "octer-ads-dsh:preferences";
var bindingPage = "https://octer.ai/workspace/ads-mcp/platforms";
var defaults = { platform: "", account: "", days: 7 };
function readPreferences() {
  try {
    const value = JSON.parse(window.localStorage.getItem(preferencesKey) ?? "{}");
    return {
      platform: labels[value.platform] ? value.platform : "",
      account: typeof value.account === "string" ? value.account : "",
      days: [7, 14, 30].includes(value.days) ? value.days : defaults.days
    };
  } catch {
    return defaults;
  }
}
function useStatus(call) {
  const [status, setStatus] = (0, import_react.useState)(null);
  const [failure, setFailure] = (0, import_react.useState)("");
  const reload = (0, import_react.useCallback)(async (signal) => {
    try {
      const next = await call("status", {}, signal);
      if (!signal?.aborted) {
        setStatus(next);
        setFailure("");
      }
    } catch (error) {
      if (!signal?.aborted) setFailure(error.message);
    }
  }, [call]);
  (0, import_react.useEffect)(() => {
    const abort = new AbortController();
    let timer;
    async function poll() {
      await reload(abort.signal);
      if (!abort.signal.aborted) timer = setTimeout(poll, 2500);
    }
    void poll();
    return () => {
      abort.abort();
      clearTimeout(timer);
    };
  }, [reload]);
  return { status, failure, reload };
}
function usePlatforms(call, connected) {
  const [platforms, setPlatforms] = (0, import_react.useState)([]);
  const [error, setError] = (0, import_react.useState)("");
  const [loading, setLoading] = (0, import_react.useState)(false);
  const [attempt, setAttempt] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    setError("");
    setPlatforms([]);
    if (!connected) {
      setLoading(false);
      return;
    }
    const abort = new AbortController();
    setLoading(true);
    call("platforms", {}, abort.signal).then((value) => {
      if (!abort.signal.aborted) setPlatforms(Array.isArray(value) ? value : []);
    }, (failure) => {
      if (!abort.signal.aborted) setError(failure.message);
    }).finally(() => {
      if (!abort.signal.aborted) setLoading(false);
    });
    return () => abort.abort();
  }, [call, connected, attempt]);
  return { platforms, error, loading, refresh: () => setAttempt((value) => value + 1) };
}
function useAccounts(call, platform) {
  const [state, setState] = (0, import_react.useState)({ platform: "", accounts: [], error: "", loading: false });
  (0, import_react.useEffect)(() => {
    if (!platform) {
      setState({ platform, accounts: [], error: "", loading: false });
      return;
    }
    const abort = new AbortController();
    setState({ platform, accounts: [], error: "", loading: true });
    void (async () => {
      const accounts = [];
      let cursor;
      for (let page = 0; page < 20; page++) {
        const data = await call("accounts", { platform, cursor }, abort.signal);
        accounts.push(...data.accounts ?? []);
        cursor = data.next_cursor;
        if (!cursor) break;
      }
      if (!abort.signal.aborted) setState({
        platform,
        accounts: accounts.filter((account) => !account.is_manager),
        error: "",
        loading: false,
        partial: Boolean(cursor)
      });
    })().catch((error) => {
      if (!abort.signal.aborted) setState({ platform, accounts: [], error: error.message, loading: false });
    });
    return () => abort.abort();
  }, [call, platform]);
  return state.platform === platform ? state : { accounts: [], error: "", loading: Boolean(platform) };
}
function Permissions({ platform }) {
  const coverage = platform?.coverage ?? "";
  if (!platform?.configured) return /* @__PURE__ */ import_react.default.createElement("span", { className: "oads-muted" }, "\u2014");
  if (/read\s*\/\s*write|读写/i.test(coverage)) return /* @__PURE__ */ import_react.default.createElement("span", { className: "oads-pill" }, "\u8BFB\u5199");
  if (/read(?:-only| access)|只读/i.test(coverage)) return /* @__PURE__ */ import_react.default.createElement("span", { className: "oads-pill" }, "\u53EA\u8BFB");
  return /* @__PURE__ */ import_react.default.createElement("span", { className: "oads-muted" }, "\u4EE5 OCTER \u6388\u6743\u4E3A\u51C6");
}
function Connection({ call, status, failure, reload, inventory, openDashboard }) {
  const [notice, setNotice] = (0, import_react.useState)("");
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [url, setUrl] = (0, import_react.useState)(null);
  const [platformLinks, setPlatformLinks] = (0, import_react.useState)({});
  const [confirmDisconnect, setConfirmDisconnect] = (0, import_react.useState)(false);
  const connected = status?.state === "connected";
  (0, import_react.useEffect)(() => {
    if (connected || !status?.pending) setUrl(null);
    if (!connected) setPlatformLinks({});
  }, [connected, status?.pending]);
  async function perform(action, input, completed) {
    setNotice("");
    setBusy(true);
    try {
      const data = await call(action, input);
      completed?.(data);
      await reload();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  }
  const activeUrl = url ?? status?.authUrl;
  return /* @__PURE__ */ import_react.default.createElement("section", { className: "oads-panel", "aria-label": "\u8D26\u53F7\u8FDE\u63A5" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-heading" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h2", null, "\u8D26\u53F7\u8FDE\u63A5"), /* @__PURE__ */ import_react.default.createElement("p", null, "\u901A\u8FC7\u6D4F\u89C8\u5668\u6388\u6743 OCTER\uFF0C\u67E5\u770B\u5E7F\u544A\u5E73\u53F0\u7ED1\u5B9A\u548C\u8BBF\u95EE\u6743\u9650\u3002")), /* @__PURE__ */ import_react.default.createElement("span", { className: "oads-pill" + (connected ? " oads-ready" : "") }, connected ? "\u5DF2\u8FDE\u63A5" : status?.pending ? "\u7B49\u5F85\u6388\u6743" : ["connecting", "reconnecting"].includes(status?.state) ? "\u8FDE\u63A5\u4E2D" : status ? "\u672A\u8FDE\u63A5" : "\u68C0\u6D4B\u4E2D")), /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-actions" }, activeUrl && !connected ? /* @__PURE__ */ import_react.default.createElement("a", { className: "oads-primary", href: activeUrl, target: "_blank", rel: "noopener noreferrer" }, "\u5728\u6D4F\u89C8\u5668\u6388\u6743") : /* @__PURE__ */ import_react.default.createElement(
    "button",
    {
      className: connected ? "" : "oads-primary",
      disabled: busy || status?.pending,
      onClick: () => void perform("authorize", {}, (data) => setUrl(data.authUrl))
    },
    connected ? "\u91CD\u65B0\u6388\u6743" : "\u8FDE\u63A5 OCTER"
  ), activeUrl && connected && /* @__PURE__ */ import_react.default.createElement("a", { href: activeUrl, target: "_blank", rel: "noopener noreferrer" }, "\u7EE7\u7EED\u6D4F\u89C8\u5668\u6388\u6743"), (connected || status?.pending) && /* @__PURE__ */ import_react.default.createElement("button", { disabled: busy, onClick: () => setConfirmDisconnect(true) }, "\u65AD\u5F00\u8FDE\u63A5"), connected && /* @__PURE__ */ import_react.default.createElement("a", { href: bindingPage, target: "_blank", rel: "noopener noreferrer" }, "\u5728 OCTER \u7BA1\u7406\u5E7F\u544A\u8D26\u53F7 \u2197"), openDashboard && /* @__PURE__ */ import_react.default.createElement("button", { onClick: openDashboard }, "\u6253\u5F00\u6295\u653E\u770B\u677F")), confirmDisconnect && /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-confirm" }, /* @__PURE__ */ import_react.default.createElement("p", null, "\u6E05\u9664\u5F53\u524D Harness \u4E2D\u4FDD\u5B58\u7684\u6388\u6743\u3002\u5E7F\u544A\u8D26\u53F7\u4ECD\u7ED1\u5B9A\u5728 OCTER\u3002"), /* @__PURE__ */ import_react.default.createElement("button", { disabled: busy, onClick: () => void perform("disconnect", {}, () => {
    setConfirmDisconnect(false);
    setUrl(null);
  }) }, "\u786E\u8BA4\u65AD\u5F00"), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setConfirmDisconnect(false) }, "\u53D6\u6D88")), (notice || failure || inventory.error) && /* @__PURE__ */ import_react.default.createElement("p", { role: "alert", className: "oads-error" }, notice || failure || inventory.error), connected && /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-platforms" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-heading" }, /* @__PURE__ */ import_react.default.createElement("h3", null, "\u5E7F\u544A\u5E73\u53F0"), /* @__PURE__ */ import_react.default.createElement("button", { onClick: inventory.refresh, disabled: inventory.loading || busy }, inventory.loading ? "\u5237\u65B0\u4E2D\u2026" : "\u5237\u65B0\u7ED1\u5B9A\u72B6\u6001")), /* @__PURE__ */ import_react.default.createElement("ul", null, Object.entries(labels).map(([key, label]) => {
    const item = inventory.platforms.find((platform) => platform.platform === key);
    return /* @__PURE__ */ import_react.default.createElement("li", { key }, /* @__PURE__ */ import_react.default.createElement("strong", null, label), /* @__PURE__ */ import_react.default.createElement("span", null, item?.configured ? "\u5DF2\u7ED1\u5B9A" : item ? "\u672A\u7ED1\u5B9A" : inventory.loading ? "\u68C0\u6D4B\u4E2D" : "\u672A\u8FD4\u56DE\u72B6\u6001"), /* @__PURE__ */ import_react.default.createElement(Permissions, { platform: item }), platformLinks[key] ? /* @__PURE__ */ import_react.default.createElement("a", { href: platformLinks[key], target: "_blank", rel: "noopener noreferrer" }, "\u7EE7\u7EED\u7ED1\u5B9A \u2197") : item && !item.configured && /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        disabled: busy,
        onClick: () => void perform("bind", { platform: key }, ({ url: link }) => {
          setPlatformLinks((links) => ({ ...links, [key]: link || bindingPage }));
        })
      },
      "\u7ED1\u5B9A"
    ));
  }))));
}
function SelectAccount({ accounts, account, onChange, loading }) {
  return /* @__PURE__ */ import_react.default.createElement("label", null, "\u5E7F\u544A\u8D26\u53F7", /* @__PURE__ */ import_react.default.createElement("select", { value: account, disabled: loading || !accounts.length, onChange: (event) => onChange(event.target.value) }, /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, loading ? "\u52A0\u8F7D\u4E2D\u2026" : "\u9009\u62E9\u8D26\u53F7"), accounts.map((item) => /* @__PURE__ */ import_react.default.createElement("option", { key: item.id, value: item.id }, item.name || item.id, item.currency ? " \xB7 " + item.currency : ""))));
}
function Settings({ call, platforms, preferences, onSave }) {
  const [draft, setDraft] = (0, import_react.useState)(preferences);
  const [notice, setNotice] = (0, import_react.useState)("");
  const result = useAccounts(call, platforms.some((row) => row.platform === draft.platform) ? draft.platform : "");
  function save() {
    if (draft.account && !result.accounts.some((account) => account.id === draft.account)) {
      setNotice("\u8BF7\u9009\u62E9\u5F53\u524D\u53EF\u8BBF\u95EE\u7684\u9ED8\u8BA4\u8D26\u53F7\u3002");
      return;
    }
    try {
      window.localStorage.setItem(preferencesKey, JSON.stringify(draft));
      onSave(draft);
      setNotice("\u5DF2\u4FDD\u5B58\u3002");
    } catch {
      setNotice("\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5 Harness \u7684\u672C\u5730\u5B58\u50A8\u3002");
    }
  }
  return /* @__PURE__ */ import_react.default.createElement("section", { className: "oads-panel", "aria-label": "\u62A5\u8868\u504F\u597D" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-heading" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h2", null, "\u62A5\u8868\u504F\u597D"), /* @__PURE__ */ import_react.default.createElement("p", null, "\u4FDD\u5B58\u5F53\u524D\u5BA2\u6237\u7AEF\u6253\u5F00\u770B\u677F\u65F6\u9ED8\u8BA4\u4F7F\u7528\u7684\u8D26\u53F7\u548C\u65E5\u671F\u8303\u56F4\u3002"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-form" }, /* @__PURE__ */ import_react.default.createElement("label", null, "\u9ED8\u8BA4\u5E73\u53F0", /* @__PURE__ */ import_react.default.createElement("select", { value: draft.platform, onChange: (event) => setDraft({ ...draft, platform: event.target.value, account: "" }) }, /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, "\u81EA\u52A8\u9009\u62E9"), platforms.map((row) => /* @__PURE__ */ import_react.default.createElement("option", { key: row.platform, value: row.platform }, labels[row.platform])))), /* @__PURE__ */ import_react.default.createElement(
    SelectAccount,
    {
      accounts: result.accounts,
      account: draft.account,
      loading: result.loading,
      onChange: (account) => setDraft({ ...draft, account })
    }
  ), /* @__PURE__ */ import_react.default.createElement("label", null, "\u9ED8\u8BA4\u5468\u671F", /* @__PURE__ */ import_react.default.createElement("select", { value: draft.days, onChange: (event) => setDraft({ ...draft, days: Number(event.target.value) }) }, [7, 14, 30].map((days) => /* @__PURE__ */ import_react.default.createElement("option", { value: days, key: days }, "\u6700\u8FD1 ", days, " \u5929"))))), /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-actions" }, /* @__PURE__ */ import_react.default.createElement("button", { disabled: result.loading, onClick: save }, "\u4FDD\u5B58\u9ED8\u8BA4\u8BBE\u7F6E"), /* @__PURE__ */ import_react.default.createElement("span", { role: "status" }, notice)), result.error && /* @__PURE__ */ import_react.default.createElement("p", { role: "alert", className: "oads-error" }, result.error));
}
function Report({ data }) {
  const [metric, setMetric] = (0, import_react.useState)("spend");
  if (data.state === "processing") return /* @__PURE__ */ import_react.default.createElement("p", { role: "status" }, "\u5E73\u53F0\u6B63\u5728\u751F\u6210\u62A5\u8868\u3002");
  const { total, days, campaigns } = summarize(data.rows ?? []);
  const account = data.account ?? {};
  const currency = account.currency || "";
  const times = days.filter((day) => day[metric] != null);
  const max = Math.max(1, ...times.map((day) => day[metric]));
  return /* @__PURE__ */ import_react.default.createElement("article", { className: "oads-report", "aria-label": "\u6295\u653E\u62A5\u8868" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-heading" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", null, labels[account.platform] || "\u5E7F\u544A\u5E73\u53F0", "\u6295\u653E\u62A5\u8868"), /* @__PURE__ */ import_react.default.createElement("p", null, [
    account.name || account.id,
    data.start_date && data.end_date && data.start_date + " \u81F3 " + data.end_date,
    currency,
    account.timezone
  ].filter(Boolean).join(" \xB7 ")))), (data.partial || data.next_cursor) && /* @__PURE__ */ import_react.default.createElement("p", { className: "oads-warn" }, "\u5F53\u524D\u62A5\u8868\u4EC5\u5305\u542B\u5DF2\u8BFB\u53D6\u7684\u660E\u7EC6\uFF0C\u6C47\u603B\u53EF\u80FD\u4E0D\u5B8C\u6574\u3002"), /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-totals" }, metrics.map(([key, label]) => /* @__PURE__ */ import_react.default.createElement("div", { key }, /* @__PURE__ */ import_react.default.createElement("span", null, label), /* @__PURE__ */ import_react.default.createElement("strong", null, formatMetric(total[key], key, currency))))), days.length ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-heading oads-trend" }, /* @__PURE__ */ import_react.default.createElement("h4", null, "\u6BCF\u65E5\u8868\u73B0"), /* @__PURE__ */ import_react.default.createElement("label", null, "\u6307\u6807 ", /* @__PURE__ */ import_react.default.createElement("select", { value: metric, onChange: (event) => setMetric(event.target.value) }, metrics.map(([key, label]) => /* @__PURE__ */ import_react.default.createElement("option", { key, value: key }, label))))), times.length ? /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-chart-scroll" }, /* @__PURE__ */ import_react.default.createElement(
    "div",
    {
      className: "oads-chart",
      role: "img",
      "aria-label": "\u6BCF\u65E5" + metrics.find(([key]) => key === metric)[1] + "\u67F1\u72B6\u56FE"
    },
    days.map((day) => /* @__PURE__ */ import_react.default.createElement("div", { key: day.date, className: "oads-bar-item", title: day.date + " \xB7 " + formatMetric(day[metric], metric, currency) }, /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-bar-track" }, day[metric] > 0 && /* @__PURE__ */ import_react.default.createElement(
      "span",
      {
        className: "oads-bar",
        style: { height: Math.max(2, Math.min(100, day[metric] / max * 100)) + "%" }
      }
    )), /* @__PURE__ */ import_react.default.createElement("span", null, day.date.slice(5))))
  )) : /* @__PURE__ */ import_react.default.createElement("p", { className: "oads-muted" }, "\u6240\u9009\u5468\u671F\u6CA1\u6709\u8FD4\u56DE\u8BE5\u6307\u6807\u3002")) : /* @__PURE__ */ import_react.default.createElement("p", { className: "oads-muted" }, "\u6240\u9009\u65E5\u671F\u5185\u6CA1\u6709\u8FD4\u56DE\u6295\u653E\u6570\u636E\u3002"), campaigns.length > 0 && /* @__PURE__ */ import_react.default.createElement("details", { open: campaigns.length < 12 }, /* @__PURE__ */ import_react.default.createElement("summary", null, "\u5E7F\u544A\u7CFB\u5217\u660E\u7EC6 \xB7 ", campaigns.length), /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-table" }, /* @__PURE__ */ import_react.default.createElement("table", null, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("th", { scope: "col" }, "\u5E7F\u544A\u7CFB\u5217"), metrics.map(([key, label]) => /* @__PURE__ */ import_react.default.createElement("th", { scope: "col", key }, label)))), /* @__PURE__ */ import_react.default.createElement("tbody", null, campaigns.map((row) => /* @__PURE__ */ import_react.default.createElement("tr", { key: row.id }, /* @__PURE__ */ import_react.default.createElement("th", { scope: "row" }, row.name), metrics.map(([key]) => /* @__PURE__ */ import_react.default.createElement("td", { key }, formatMetric(row[key], key, currency))))))))), data.conversion_definition && /* @__PURE__ */ import_react.default.createElement("p", { className: "oads-muted" }, data.conversion_definition));
}
function Dashboard({ call, platforms, preferences }) {
  const [platformChoice, setPlatform] = (0, import_react.useState)("");
  const [accountChoice, setAccount] = (0, import_react.useState)("");
  const [dates, setDates] = (0, import_react.useState)(null);
  const [output, setOutput] = (0, import_react.useState)(null);
  const [error, setError] = (0, import_react.useState)("");
  const [loading, setLoading] = (0, import_react.useState)(false);
  const platform = platforms.find((item) => item.platform === (platformChoice || preferences.platform))?.platform || platforms[0]?.platform || "";
  const info = useAccounts(call, platform);
  const account = info.accounts.find((item) => item.id === (accountChoice || preferences.account)) ?? info.accounts[0];
  const { start, end } = dates ?? dateRange(preferences.days, platform === "microsoft_ads" ? "UTC" : account?.timezone);
  const reportKey = JSON.stringify([platform, account?.id, start, end]);
  const current = output?.key === reportKey ? output.data : null;
  async function run(range, reportId) {
    if (!account || loading || !range.start || !range.end) return;
    setLoading(true);
    setError("");
    setOutput(null);
    const key = JSON.stringify([platform, account.id, range.start, range.end]);
    try {
      let cursor;
      const rows = [];
      for (let page = 0; page < 20; page++) {
        const data = await call("report", { platform, account: account.id, ...range, reportId, cursor });
        rows.push(...data.rows ?? []);
        cursor = data.next_cursor;
        if (!cursor || data.state === "processing" || page === 19) {
          setOutput({ key, data: { ...data, rows, partial: Boolean(cursor) } });
          break;
        }
        reportId = data.report_id || reportId;
      }
    } catch (failure) {
      setError(failure.message);
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ import_react.default.createElement("section", { className: "oads-panel", "aria-label": "\u6295\u653E\u6570\u636E" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-heading" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h2", null, "\u6295\u653E\u6570\u636E"), /* @__PURE__ */ import_react.default.createElement("p", null, "\u67E5\u770B\u5355\u4E2A\u8D26\u53F7\u7684\u82B1\u8D39\u3001\u5C55\u793A\u3001\u70B9\u51FB\u548C\u8F6C\u5316\u3002")), /* @__PURE__ */ import_react.default.createElement(Permissions, { platform: platforms.find((item) => item.platform === platform) })), !!platforms.length && /* @__PURE__ */ import_react.default.createElement("form", { onSubmit: (event) => {
    event.preventDefault();
    void run({ start, end });
  } }, /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-form" }, /* @__PURE__ */ import_react.default.createElement("label", null, "\u5E73\u53F0", /* @__PURE__ */ import_react.default.createElement("select", { value: platform, disabled: loading, onChange: (event) => {
    setPlatform(event.target.value);
    setAccount("");
    setDates(null);
  } }, platforms.map((item) => /* @__PURE__ */ import_react.default.createElement("option", { key: item.platform, value: item.platform }, labels[item.platform])))), /* @__PURE__ */ import_react.default.createElement(
    SelectAccount,
    {
      accounts: info.accounts,
      account: account?.id ?? "",
      loading: info.loading || loading,
      onChange: (value) => {
        setAccount(value);
        setDates(null);
      }
    }
  ), /* @__PURE__ */ import_react.default.createElement("label", null, "\u5F00\u59CB\u65E5\u671F", /* @__PURE__ */ import_react.default.createElement("input", { required: true, type: "date", value: start, max: end, disabled: loading, onChange: (event) => setDates({ start: event.target.value, end }) })), /* @__PURE__ */ import_react.default.createElement("label", null, "\u7ED3\u675F\u65E5\u671F", /* @__PURE__ */ import_react.default.createElement("input", { required: true, type: "date", value: end, min: start, disabled: loading, onChange: (event) => setDates({ start, end: event.target.value }) }))), /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-actions" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "submit", className: "oads-primary", disabled: !account || loading || !start || !end }, loading ? "\u67E5\u8BE2\u4E2D\u2026" : "\u67E5\u770B\u6295\u653E\u62A5\u8868"), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", disabled: !account || loading, onClick: () => {
    const range = dateRange(7, platform === "microsoft_ads" ? "UTC" : account.timezone);
    setDates(range);
    void run(range);
  } }, "\u6700\u8FD1 7 \u5929"), current?.state === "processing" && current.report_id && /* @__PURE__ */ import_react.default.createElement(
    "button",
    {
      type: "button",
      disabled: loading,
      onClick: () => void run({ start, end }, current.report_id)
    },
    "\u5237\u65B0\u62A5\u8868\u8FDB\u5EA6"
  ))), !platforms.length && /* @__PURE__ */ import_react.default.createElement("p", { className: "oads-muted" }, "\u8FDE\u63A5 OCTER \u5E76\u7ED1\u5B9A\u5E7F\u544A\u8D26\u53F7\u540E\uFF0C\u5373\u53EF\u67E5\u770B\u6295\u653E\u62A5\u8868\u3002"), info.partial && /* @__PURE__ */ import_react.default.createElement("p", { className: "oads-warn" }, "\u8D26\u53F7\u5217\u8868\u4EC5\u5305\u542B\u5DF2\u8BFB\u53D6\u7684\u8D26\u53F7\u3002"), (error || info.error) && /* @__PURE__ */ import_react.default.createElement("p", { role: "alert", className: "oads-error" }, error || info.error), current && /* @__PURE__ */ import_react.default.createElement(Report, { data: current }));
}
function Workspace({ call, full, openDashboard }) {
  const [preferences, setPreferences] = (0, import_react.useState)(readPreferences);
  const status = useStatus(call);
  const connected = status.status?.state === "connected";
  const data = usePlatforms(call, connected);
  const available = data.platforms.filter((item) => item.configured && labels[item.platform]);
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "oads " + (full ? "oads-workspace" : "") }, /* @__PURE__ */ import_react.default.createElement("style", null, styles), full && /* @__PURE__ */ import_react.default.createElement("header", { className: "oads-hero" }, /* @__PURE__ */ import_react.default.createElement("p", null, "OCTER Ads"), /* @__PURE__ */ import_react.default.createElement("h1", null, "\u6295\u653E\u770B\u677F"), /* @__PURE__ */ import_react.default.createElement("span", null, "\u67E5\u8BE2\u6295\u653E\u6548\u679C\u3001\u4F18\u5316\u5E7F\u544A\u6295\u653E\uFF0C\u64CD\u4F5C\u6743\u9650\u7531 OCTER \u63A7\u5236\u3002")), full && /* @__PURE__ */ import_react.default.createElement(Dashboard, { call, platforms: available, preferences }), /* @__PURE__ */ import_react.default.createElement(Connection, { call, ...status, inventory: data, openDashboard }), /* @__PURE__ */ import_react.default.createElement(Settings, { call, platforms: available, preferences, onSave: setPreferences }));
}
function ToolReport({ phase, block, inspect }) {
  if (phase !== "result") return /* @__PURE__ */ import_react.default.createElement("div", { className: "oads" }, /* @__PURE__ */ import_react.default.createElement("style", null, styles), /* @__PURE__ */ import_react.default.createElement("p", { className: "oads-muted" }, "\u6B63\u5728\u67E5\u8BE2\u6295\u653E\u62A5\u8868\u2026"));
  const payload = fromToolContent(block);
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "oads" }, /* @__PURE__ */ import_react.default.createElement("style", null, styles), payload && !block.isError ? /* @__PURE__ */ import_react.default.createElement(Report, { data: payload }) : /* @__PURE__ */ import_react.default.createElement("p", { className: "oads-muted" }, block.content?.find((item) => item.type === "text")?.text || "\u672C\u6B21\u5DE5\u5177\u8C03\u7528\u672A\u8FD4\u56DE\u53EF\u7ED8\u5236\u7684\u62A5\u8868\u3002"), inspect && /* @__PURE__ */ import_react.default.createElement("button", { type: "button", onClick: inspect }, "\u67E5\u770B\u8C03\u7528\u8BE6\u60C5"));
}
var name = "octer-ads-client";
var inject = ["slots", "connection", "layout"];
function apply(ctx) {
  const call = async (action, fields, signal) => {
    const input = Object.fromEntries(Object.entries({ action, ...fields }).filter(([, value]) => value !== void 0));
    const response = await ctx.connection.rpc.call("/api", "octerAdsWorkspace/request", { args: { input } }, signal);
    if (!response.ok) throw new Error(response.error?.message ?? "\u6682\u65F6\u65E0\u6CD5\u8BBF\u95EE OCTER Ads\u3002");
    return response.value;
  };
  const add = (slot, placement, Component) => ctx.slots.inject(slot, () => ctx.slots.register({ name: slot, ...placement }, Component));
  add("plugins.bundle.config", { key: "octer-ads-dsh" }, () => /* @__PURE__ */ import_react.default.createElement(
    Workspace,
    {
      call,
      full: false,
      openDashboard: () => ctx.layout.selectPanel("octer-ads")
    }
  ));
  add("main", { key: "octer-ads" }, () => /* @__PURE__ */ import_react.default.createElement(Workspace, { call, full: true }));
  add("sidebar.panellist", { id: "octer-ads", label: "OCTER Ads", order: 55 }, () => /* @__PURE__ */ import_react.default.createElement("span", { "aria-hidden": "true" }, "\u25A5"));
  for (const tool of ["get_performance", "get_microsoft_ads_report", "get_amazon_report"]) {
    add("tool.call.toolview", { key: "mcp__ads__" + tool }, ToolReport);
  }
}
return module.exports;
} });
