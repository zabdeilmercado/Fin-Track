import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { appWorker } from './scripts/app-worker.mjs'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), appWorker(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
