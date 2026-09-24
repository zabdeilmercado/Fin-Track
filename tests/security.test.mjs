import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const rootPath = fileURLToPath(root)

test('deployment applies restrictive browser security headers', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'))
  const headers = Object.fromEntries(
    config.headers.find((rule) => rule.source === '/(.*)').headers.map((item) => [
      item.key,
      item.value,
    ]),
  )
  assert.match(headers['Content-Security-Policy'], /default-src 'self'/)
  assert.match(headers['Content-Security-Policy'], /frame-ancestors 'none'/)
  assert.match(headers['Content-Security-Policy'], /ktsfrggymjgvnekefpyf\.supabase\.co/)
  assert.equal(headers['X-Frame-Options'], 'DENY')
  assert.equal(headers['X-Content-Type-Options'], 'nosniff')
  assert.match(headers['Strict-Transport-Security'], /max-age=63072000/)
})

test('environment files and local database artifacts are ignored', async () => {
  const ignore = await readFile(new URL('../.gitignore', import.meta.url), 'utf8')
  for (const pattern of ['.env.*', '!.env.example', '.vercel', '*.sqlite', '*.db', '*.dump']) {
    assert.match(ignore, new RegExp(pattern.replaceAll('.', '\\.').replace('*', '.*')))
  }
  const example = await readFile(new URL('../.env.example', import.meta.url), 'utf8')
  assert.match(example, /VITE_SUPABASE_URL=https:\/\/your-project\.supabase\.co/)
  assert.doesNotMatch(example, /service_role|sb_secret_/)
})

test('application source avoids direct HTML injection sinks', async () => {
  const directories = ['components', 'views']
  const files = []
  const visit = async (directory) => {
    for (const entry of await readdir(join(rootPath, 'src', directory), { withFileTypes: true })) {
      if (entry.isDirectory()) await visit(join(directory, entry.name))
      else if (entry.name.endsWith('.vue')) files.push(join(rootPath, 'src', directory, entry.name))
    }
  }
  for (const directory of directories) await visit(directory)
  const source = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n')
  assert.doesNotMatch(source, /v-html|innerHTML|insertAdjacentHTML|eval\s*\(/)
})
