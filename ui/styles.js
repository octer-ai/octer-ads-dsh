export const styles = `
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
`
