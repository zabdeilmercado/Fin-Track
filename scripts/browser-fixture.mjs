// Local-only browser test fixture. Never used by the application or production build.
import { createServer as httpServer } from 'node:http'
import { createServer as viteServer } from 'vite'
const fixtureEmail = process.env.FINTRACK_FIXTURE_EMAIL
const fixturePassword = process.env.FINTRACK_FIXTURE_PASSWORD
if (!fixtureEmail || !fixturePassword) {
  throw new Error('Set FINTRACK_FIXTURE_EMAIL and FINTRACK_FIXTURE_PASSWORD before starting the fixture.')
}
const rows = new Map()
const user = {
  id: '00000000-0000-4000-8000-000000000001',
  aud: 'authenticated',
  role: 'authenticated',
  email: fixtureEmail,
  email_confirmed_at: new Date().toISOString(),
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: { name: 'Test user' },
}
const token = () => {
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url')
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ sub: user.id, aud: 'authenticated', role: 'authenticated', exp: Math.floor(Date.now() / 1000) + 3600 })}.local-test`
}
const api = httpServer(async (req, res) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://127.0.0.1:5175',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, prefer, x-client-info',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  }
  const reply = (status, data) => {
    res.writeHead(status, headers)
    res.end(JSON.stringify(data))
  }
  if (req.method === 'OPTIONS') return reply(200, {})
  const url = new URL(req.url, 'http://127.0.0.1:54329')
  let raw = ''
  for await (const part of req) raw += part
  const body = raw ? JSON.parse(raw) : {}
  if (url.pathname === '/auth/v1/token') {
    if (body.email && (body.email !== fixtureEmail || body.password !== fixturePassword))
      return reply(400, { error: 'invalid_grant', error_description: 'Invalid test credentials' })
    return reply(200, {
      access_token: token(),
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'local-refresh',
      user,
    })
  }
  if (url.pathname === '/auth/v1/user') return reply(200, user)
  if (url.pathname === '/auth/v1/logout') return reply(200, {})
  if (url.pathname === '/rest/v1/finance_state') {
    if (req.method === 'GET') return reply(200, rows.has(user.id) ? [rows.get(user.id)] : [])
    if (
      req.method === 'PATCH' &&
      Number(url.searchParams.get('version')?.slice(3)) !== rows.get(user.id)?.version
    )
      return reply(200, null)
    rows.set(user.id, { user_id: user.id, ...body })
    return reply(200, { version: body.version })
  }
  reply(404, { message: 'Fixture endpoint not available' })
})
api.listen(54329, '127.0.0.1')
const server = await viteServer({
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('http://127.0.0.1:54329'),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(
      'sb_publishable_fixture_only_1234567890',
    ),
  },
  server: { host: '127.0.0.1', port: 5175, strictPort: true },
})
await server.listen()
process.stdout.write(`Local test app: http://127.0.0.1:5175 — sign in as ${fixtureEmail}\n`)
const stop = async () => {
  api.close()
  await server.close()
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
