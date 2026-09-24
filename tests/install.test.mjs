import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const manifest = JSON.parse(
  readFileSync(new URL('../public/manifest.webmanifest', import.meta.url)),
)
test('install manifest has standalone navigation and real square PNG icons', () => {
  assert.equal(manifest.display, 'standalone')
  assert.equal(manifest.start_url, '/dashboard')
  for (const icon of manifest.icons) {
    const image = readFileSync(new URL('../public' + icon.src, import.meta.url))
    assert.equal(image.subarray(1, 4).toString(), 'PNG')
    assert.equal(image.readUInt32BE(16), Number(icon.sizes.split('x')[0]))
    assert.equal(image.readUInt32BE(20), Number(icon.sizes.split('x')[1]))
  }
})
