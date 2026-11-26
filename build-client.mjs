import { build } from 'esbuild'

await build({
  entryPoints: ['ui/client.jsx'],
  outfile: 'client.cjs',
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  external: ['react'],
  loader: { '.png': 'dataurl', '.svg': 'dataurl' },
  banner: { js: 'window.__ModuleLoader__.load({ id: "octer-ads-dsh", factory: function(require) {\nconst module = { exports: {} };' },
  footer: { js: 'return module.exports;\n} });' },
})
