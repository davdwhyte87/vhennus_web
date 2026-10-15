// Bakes the Firebase web config into the service-worker files at
// dev-start/build time. Vite never processes public/ (copied verbatim),
// and workers can't read import.meta.env — so placeholders in the
// *.template.js files are replaced with the VITE_FIREBASE_* values.
//
// Source order: real process env first (Vercel dashboard at build),
// then the local .env file (dev convenience). Missing values leave the
// placeholder replaced with '' and push stays safely disabled.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')

function loadDotEnv() {
  const out = {}
  const p = join(root, '.env')
  if (!existsSync(p)) return out
  for (const rawLine of readFileSync(p, 'utf8').split('\n')) {
    const line = rawLine.trim()
    if (line === '' || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) out[key] = value
  }
  return out
}

const fileEnv = loadDotEnv()
const get = (k) => process.env[k] ?? fileEnv[k] ?? ''

const values = {
  __FIREBASE_API_KEY__: get('VITE_FIREBASE_API_KEY'),
  __FIREBASE_AUTH_DOMAIN__: get('VITE_FIREBASE_AUTH_DOMAIN'),
  __FIREBASE_PROJECT_ID__: get('VITE_FIREBASE_PROJECT_ID'),
  __FIREBASE_MESSAGING_SENDER_ID__: get('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  __FIREBASE_APP_ID__: get('VITE_FIREBASE_APP_ID'),
}

const pairs = [
  ['sw.template.js', 'sw.js'],
  ['firebase-messaging-sw.template.js', 'firebase-messaging-sw.js'],
]

for (const [template, output] of pairs) {
  const templatePath = join(publicDir, template)
  if (!existsSync(templatePath)) {
    console.warn(`[sw-config] template missing: ${template} (skipped)`)
    continue
  }
  let content = readFileSync(templatePath, 'utf8')
  for (const [token, value] of Object.entries(values)) {
    const safe = String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    content = content.replaceAll(token, () => safe)
  }
  writeFileSync(join(publicDir, output), content)
  console.info(`[sw-config] generated public/${output}`)
}

const missing = Object.entries({
  VITE_FIREBASE_API_KEY: values.__FIREBASE_API_KEY__,
  VITE_FIREBASE_AUTH_DOMAIN: values.__FIREBASE_AUTH_DOMAIN__,
  VITE_FIREBASE_PROJECT_ID: values.__FIREBASE_PROJECT_ID__,
  VITE_FIREBASE_MESSAGING_SENDER_ID:
    values.__FIREBASE_MESSAGING_SENDER_ID__,
  VITE_FIREBASE_APP_ID: values.__FIREBASE_APP_ID__,
})
  .filter(([, v]) => !v)
  .map(([k]) => k)

if (missing.length > 0) {
  console.warn(
    `[sw-config] missing ${missing.join(', ')} — background push stays disabled until set`,
  )
} else {
  console.info('[sw-config] firebase config baked into service workers')
}
