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

// binding.js
var bindingClient = "deepseek_harness";
var bindingPage = `https://octer.ai/workspace/ads-mcp/platforms?client=${bindingClient}`;

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
.oads-platforms { margin-top: 18px; container-type: inline-size; }
.oads-platforms ul {
  display: grid;
  grid-template-columns: minmax(115px, 1fr) minmax(70px, .8fr) minmax(72px, 1fr) auto;
  column-gap: 8px;
  padding: 0;
  margin: 8px 0 0;
  list-style: none;
}
.oads-platforms li {
  min-height: 42px;
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: center;
  row-gap: 6px;
  border-top: 1px solid var(--oads-border);
  padding: 6px 0;
}
.oads-platforms li > :nth-child(4) { justify-self: end; }
.oads-platform-name { display: flex; align-items: center; gap: 8px; }
.oads-platform-permission { display: flex; justify-content: center; text-align: center; }
.oads-platform-icon {
  box-sizing: border-box;
  flex: none;
  object-fit: contain;
  background: #fff;
  border-radius: 5px;
  padding: 2px;
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
@container (max-width: 375px) {
  .oads-platforms ul { grid-template-columns: minmax(0, 1fr) minmax(0, 70px) minmax(0, 80px); }
  .oads-platforms li > :nth-child(4) { grid-column: 1 / -1; }
}
`;

// ui/platform-icons/amazon-ads.png
var amazon_ads_default = "data:image/png;base64,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";

// ui/platform-icons/google-ads.svg
var google_ads_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 192 192" height="192" viewBox="0 0 192 192" width="192"><g><rect fill="none" height="192" width="192"/><g><rect fill="%23FBBC04" height="58.67" transform="matrix(0.5 -0.866 0.866 0.5 -46.2127 103.666)" width="117.33" x="8" y="62.52"/><path d="M180.07,127.99L121.4,26.38c-8.1-14.03-26.04-18.84-40.07-10.74c-14.03,8.1-18.84,26.04-10.74,40.07 l58.67,101.61c8.1,14.03,26.04,18.83,40.07,10.74C183.36,159.96,188.16,142.02,180.07,127.99z" fill="%234285F4"/><circle cx="37.34" cy="142.66" fill="%2334A853" r="29.33"/></g></g></svg>';

// ui/platform-icons/meta.svg
var meta_default = 'data:image/svg+xml,<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">%0A<path d="M10.5119 6.03125C10.5023 6.03125 10.4927 6.03128 10.4831 6.03133L10.4436 9.28995C10.4526 9.28986 10.4616 9.28978 10.4707 9.28978H10.4707C12.6156 9.28978 14.2792 10.9809 17.8952 17.0717L18.1157 17.4425L18.1301 17.4668L20.1543 14.4297L20.1403 14.4062C19.6639 13.6315 19.2062 12.9186 18.7673 12.2677C18.2583 11.5135 17.7715 10.8397 17.2991 10.2382C14.907 7.19246 12.906 6.03125 10.5119 6.03125Z" fill="url(%23paint0_linear)"/>%0A<path d="M10.4832 6.03133C8.07758 6.04371 5.95081 7.5993 4.4151 9.97968C4.4106 9.98665 4.40611 9.99363 4.40161 10.0006L7.22059 11.5349C7.22516 11.528 7.22976 11.5211 7.23436 11.5142C8.13112 10.164 9.24711 9.30277 10.4438 9.28995C10.4528 9.28986 10.4618 9.28978 10.4709 9.28978L10.5121 6.03125C10.5025 6.03125 10.4929 6.03128 10.4832 6.03133Z" fill="url(%23paint1_linear)"/>%0A<path d="M4.41535 9.98047C4.41086 9.98744 4.40636 9.99442 4.40187 10.0014C3.39273 11.5723 2.64046 13.5 2.2339 15.5796C2.23214 15.5886 2.23039 15.5976 2.22864 15.6066L5.39564 16.3538C5.3973 16.3448 5.39896 16.3358 5.40063 16.3267C5.73914 14.4991 6.38363 12.8041 7.22083 11.5357C7.2254 11.5288 7.23 11.5219 7.2346 11.515L4.41535 9.98047Z" fill="url(%23paint2_linear)"/>%0A<path d="M5.40046 16.3253L2.23373 15.5781C2.23197 15.5871 2.23021 15.5961 2.22846 15.6052C2.00677 16.7488 1.89399 17.911 1.89162 19.0759C1.89161 19.0853 1.8916 19.0948 1.8916 19.1042L5.13949 19.3947C5.13923 19.3853 5.13896 19.376 5.13874 19.3665C5.13715 19.2989 5.13634 19.2304 5.13631 19.161C5.13793 18.2189 5.22467 17.2789 5.39547 16.3524C5.39712 16.3434 5.39879 16.3343 5.40046 16.3253Z" fill="url(%23paint3_linear)"/>%0A<path d="M5.23828 20.4083C5.18002 20.0735 5.147 19.7348 5.13949 19.395C5.13923 19.3855 5.13896 19.3762 5.13874 19.3667L1.89162 19.0762C1.89161 19.0856 1.8916 19.095 1.8916 19.1044V19.1063C1.8916 19.8313 1.95207 20.5101 2.06958 21.1373C2.07127 21.1463 2.07294 21.1552 2.07467 21.1643L5.24319 20.4354C5.24152 20.4264 5.2399 20.4174 5.23828 20.4083Z" fill="url(%23paint4_linear)"/>%0A<path d="M5.97788 22.0873C5.62446 21.7015 5.37433 21.145 5.24283 20.4334C5.24117 20.4244 5.23955 20.4153 5.23793 20.4062L2.06921 21.1352C2.07091 21.1443 2.07258 21.1532 2.07431 21.1622C2.31381 22.4197 2.78352 23.4677 3.45618 24.2605C3.46216 24.2676 3.46816 24.2746 3.47418 24.2816L5.99676 22.1076C5.99045 22.1009 5.98413 22.0941 5.97788 22.0873Z" fill="url(%23paint5_linear)"/>%0A<path d="M15.3659 13.0742C13.4565 16.003 12.2997 17.84 12.2997 17.84C9.75613 21.8273 8.87619 22.7209 7.46004 22.7209C6.86912 22.7209 6.37545 22.5105 5.99724 22.1083C5.99094 22.1016 5.98462 22.0948 5.97837 22.088L3.45667 24.2613C3.46265 24.2683 3.46865 24.2754 3.47467 24.2824C4.40346 25.365 5.71446 25.9657 7.3363 25.9657C9.79005 25.9657 11.5548 24.8089 14.6921 19.3249C14.6921 19.3249 15.9999 17.0155 16.8995 15.4246C16.3422 14.5248 15.8351 13.7459 15.3659 13.0742Z" fill="%230082FB"/>%0A<path d="M18.7696 8.45312C18.7631 8.45996 18.7566 8.46694 18.7501 8.47379C18.2487 9.00804 17.7675 9.60466 17.2993 10.2377C17.7717 10.8392 18.2594 11.5143 18.7685 12.2684C19.3684 11.3425 19.9284 10.5925 20.4773 10.0177C20.4838 10.0109 20.4902 10.0043 20.4967 9.99749L18.7696 8.45312Z" fill="url(%23paint6_linear)"/>%0A<path d="M28.0392 8.16596C26.7076 6.82063 25.1197 6.03125 23.4223 6.03125C21.6324 6.03125 20.1269 7.01209 18.7689 8.45306C18.7625 8.45989 18.7559 8.46688 18.7495 8.47373L20.4767 10.0176C20.4832 10.0108 20.4896 10.0042 20.4961 9.99742C21.3906 9.06692 22.2564 8.60233 23.2161 8.60233H23.2161C24.249 8.60233 25.2161 9.08859 26.0536 9.94106C26.0601 9.94774 26.0666 9.95436 26.0732 9.96109L28.059 8.18599C28.0524 8.17928 28.0458 8.17264 28.0392 8.16596Z" fill="%230082FB"/>%0A<path d="M31.8895 18.6478C31.8149 14.3282 30.3034 10.4665 28.0597 8.18604C28.053 8.17933 28.0464 8.1727 28.0398 8.16602L26.0542 9.94111C26.0608 9.94779 26.0673 9.95441 26.0738 9.96114C27.7617 11.695 28.9195 14.9199 29.0248 18.6468C29.025 18.6562 29.0253 18.6656 29.0256 18.675L31.89 18.6759C31.8898 18.6665 31.8897 18.6572 31.8895 18.6478Z" fill="url(%23paint7_linear)"/>%0A<path d="M31.8892 18.6756C31.8891 18.6662 31.8889 18.6568 31.8888 18.6474L29.024 18.6465C29.0243 18.6559 29.0246 18.6652 29.0248 18.6746C29.0295 18.8496 29.0318 19.0255 29.0318 19.2026C29.0318 20.2187 28.8801 21.0401 28.5714 21.6331C28.5668 21.6419 28.5621 21.6508 28.5575 21.6595L30.6934 23.8808C30.6987 23.8728 30.7039 23.8647 30.7091 23.8566C31.4845 22.6602 31.8916 20.9981 31.8916 18.9826C31.8916 18.88 31.8908 18.7776 31.8892 18.6756Z" fill="url(%23paint8_linear)"/>%0A<path d="M28.5715 21.6328C28.5669 21.6416 28.5622 21.6504 28.5576 21.6591C28.2904 22.159 27.9092 22.4924 27.4108 22.6382L28.3845 25.7068C28.5134 25.663 28.6389 25.6139 28.7611 25.5593C28.7975 25.5431 28.8337 25.5264 28.8696 25.5092C28.8903 25.4993 28.9109 25.4892 28.9314 25.479C29.5752 25.1581 30.1193 24.6849 30.5593 24.0751C30.5862 24.0378 30.6128 24.0003 30.6389 23.9621C30.6573 23.9351 30.6755 23.9079 30.6934 23.8805C30.6987 23.8725 30.7039 23.8644 30.7092 23.8563L28.5715 21.6328Z" fill="url(%23paint9_linear)"/>%0A<path d="M26.7913 22.7234C26.4648 22.7234 26.1767 22.6748 25.8948 22.5488L24.8978 25.6905C25.4582 25.8819 26.0559 25.9682 26.7225 25.9682C27.3367 25.9682 27.9005 25.8762 28.4116 25.6991L27.4381 22.6315C27.2283 22.6944 27.0103 22.7254 26.7913 22.7234V22.7234Z" fill="url(%23paint10_linear)"/>%0A<path d="M24.7959 21.6464C24.7897 21.6393 24.7836 21.6322 24.7774 21.625L22.4834 24.0108C22.4898 24.0177 22.4962 24.0246 22.5026 24.0314C23.2998 24.8808 24.0609 25.4078 24.9241 25.697L25.9203 22.5577C25.5565 22.4014 25.2047 22.1182 24.7959 21.6464Z" fill="url(%23paint11_linear)"/>%0A<path d="M24.7774 21.6268C24.0893 20.8266 23.2381 19.4942 21.8991 17.3398L20.1542 14.4297L20.1402 14.4062L18.1156 17.4426L18.13 17.4668L19.3664 19.5467C20.5648 21.5522 21.5412 23.003 22.4834 24.0126C22.4898 24.0195 22.4962 24.0263 22.5026 24.0331L24.7958 21.6482C24.7897 21.6411 24.7836 21.634 24.7774 21.6268Z" fill="url(%23paint12_linear)"/>%0A<defs>%0A<linearGradient id="paint0_linear" x1="18.8088" y1="16.2317" x2="12.0884" y2="7.42566" gradientUnits="userSpaceOnUse">%0A<stop offset="0.0006" stop-color="%230867DF"/>%0A<stop offset="0.4539" stop-color="%230668E1"/>%0A<stop offset="0.8591" stop-color="%230064E0"/>%0A</linearGradient>%0A<linearGradient id="paint1_linear" x1="5.72574" y1="10.5272" x2="10.333" y2="7.02944" gradientUnits="userSpaceOnUse">%0A<stop offset="0.1323" stop-color="%230064DF"/>%0A<stop offset="0.9988" stop-color="%230064E0"/>%0A</linearGradient>%0A<linearGradient id="paint2_linear" x1="3.77317" y1="15.6609" x2="5.62131" y2="11.0086" gradientUnits="userSpaceOnUse">%0A<stop offset="0.0147" stop-color="%230072EC"/>%0A<stop offset="0.6881" stop-color="%230064DF"/>%0A</linearGradient>%0A<linearGradient id="paint3_linear" x1="3.52202" y1="19.0203" x2="3.73586" y2="16.179" gradientUnits="userSpaceOnUse">%0A<stop offset="0.0731" stop-color="%23007CF6"/>%0A<stop offset="0.9943" stop-color="%230072EC"/>%0A</linearGradient>%0A<linearGradient id="paint4_linear" x1="3.63962" y1="20.5639" x2="3.48665" y2="19.4256" gradientUnits="userSpaceOnUse">%0A<stop offset="0.0731" stop-color="%23007FF9"/>%0A<stop offset="1" stop-color="%23007CF6"/>%0A</linearGradient>%0A<linearGradient id="paint5_linear" x1="3.54947" y1="20.8609" x2="4.50275" y2="22.8828" gradientUnits="userSpaceOnUse">%0A<stop offset="0.0731" stop-color="%23007FF9"/>%0A<stop offset="1" stop-color="%230082FB"/>%0A</linearGradient>%0A<linearGradient id="paint6_linear" x1="18.2019" y1="11.0803" x2="19.4622" y2="9.3373" gradientUnits="userSpaceOnUse">%0A<stop offset="0.2799" stop-color="%23007FF8"/>%0A<stop offset="0.9141" stop-color="%230082FB"/>%0A</linearGradient>%0A<linearGradient id="paint7_linear" x1="27.7838" y1="8.82128" x2="30.4203" y2="18.5198" gradientUnits="userSpaceOnUse">%0A<stop stop-color="%230082FB"/>%0A<stop offset="0.9995" stop-color="%230081FA"/>%0A</linearGradient>%0A<linearGradient id="paint8_linear" x1="31.0561" y1="18.8904" x2="29.3875" y2="22.2622" gradientUnits="userSpaceOnUse">%0A<stop offset="0.0619" stop-color="%230081FA"/>%0A<stop offset="1" stop-color="%230080F9"/>%0A</linearGradient>%0A<linearGradient id="paint9_linear" x1="28.0615" y1="24.0495" x2="29.6212" y2="22.9872" gradientUnits="userSpaceOnUse">%0A<stop stop-color="%23027AF3"/>%0A<stop offset="1" stop-color="%230080F9"/>%0A</linearGradient>%0A<linearGradient id="paint10_linear" x1="25.6157" y1="24.2585" x2="27.7831" y2="24.2585" gradientUnits="userSpaceOnUse">%0A<stop stop-color="%230377EF"/>%0A<stop offset="0.9994" stop-color="%230279F1"/>%0A</linearGradient>%0A<linearGradient id="paint11_linear" x1="23.731" y1="23.0623" x2="25.2892" y2="23.9791" gradientUnits="userSpaceOnUse">%0A<stop offset="0.0019" stop-color="%230471E9"/>%0A<stop offset="1" stop-color="%230377EF"/>%0A</linearGradient>%0A<linearGradient id="paint12_linear" x1="18.9779" y1="16.3045" x2="23.9693" y2="22.5803" gradientUnits="userSpaceOnUse">%0A<stop offset="0.2765" stop-color="%230867DF"/>%0A<stop offset="1" stop-color="%230471E9"/>%0A</linearGradient>%0A</defs>%0A</svg>%0A';

// ui/platform-icons/microsoft-ads.png
var microsoft_ads_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAD1BMVEUAAADyUCJ/ugAApO//uQA8phaAAAAAAXRSTlMAQObYZgAAACZJREFUOMtjEEQAASYlBGAYlRiVICxBOjBGAAMWFwQYlRiVICwBAP5Ark3kKPwZAAAAAElFTkSuQmCC";

// ui/platform-icons/openai.png
var openai_default = "data:image/png;base64,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";

// ui/platform-icons/tiktok.svg
var tiktok_default = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23171719">%0A  <rect width="24" height="24" rx="4" fill="%23fff"/>%0A  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>%0A</svg>%0A';

// ui/client.jsx
var preferencesKey = "octer-ads-dsh:preferences";
var defaults = { platform: "", account: "", days: 7 };
var platformIcons = {
  openai_ads: openai_default,
  google_ads: google_ads_default,
  meta_ads: meta_default,
  microsoft_ads: microsoft_ads_default,
  amazon_ads: amazon_ads_default,
  tiktok_ads: tiktok_default
};
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
    return /* @__PURE__ */ import_react.default.createElement("li", { key }, /* @__PURE__ */ import_react.default.createElement("strong", { className: "oads-platform-name" }, /* @__PURE__ */ import_react.default.createElement("img", { className: "oads-platform-icon", src: platformIcons[key], alt: "", width: "22", height: "22" }), label), /* @__PURE__ */ import_react.default.createElement("span", null, item?.configured ? "\u5DF2\u7ED1\u5B9A" : item ? "\u672A\u7ED1\u5B9A" : inventory.loading ? "\u68C0\u6D4B\u4E2D" : "\u672A\u8FD4\u56DE\u72B6\u6001"), /* @__PURE__ */ import_react.default.createElement("div", { className: "oads-platform-permission" }, /* @__PURE__ */ import_react.default.createElement(Permissions, { platform: item })), platformLinks[key] ? /* @__PURE__ */ import_react.default.createElement("a", { href: platformLinks[key], target: "_blank", rel: "noopener noreferrer" }, "\u7EE7\u7EED\u7ED1\u5B9A \u2197") : item && !item.configured && /* @__PURE__ */ import_react.default.createElement(
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
  add("sidebar.panellist", { id: "octer-ads", label: "OCTER Ads", order: 55 }, ({ size = 16 }) => /* @__PURE__ */ import_react.default.createElement(
    "svg",
    {
      "aria-hidden": "true",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    },
    /* @__PURE__ */ import_react.default.createElement("path", { d: "M5.5 13V9.5a6.5 6.5 0 0 1 13 0V13M5.5 13a3 3 0 1 0 2.5 3M18.5 13a3 3 0 1 1-2.5 3M8 16v2a2 2 0 0 0 4 0v-2m0 2a2 2 0 0 0 4 0v-2M9 10h.01M15 10h.01" })
  ));
  for (const tool of ["get_performance", "get_microsoft_ads_report", "get_amazon_report"]) {
    add("tool.call.toolview", { key: "mcp__ads__" + tool }, ToolReport);
  }
}
return module.exports;
} });
