import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './assets/main.css'

import { setupAppInstall } from './services/appInstall'
import App from './App.vue'
import router from './router'
import { supabase } from './utils/supabase'
import { useFinanceStore } from './stores/finance'

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#2563EB',
          secondary: '#0F766E',
          accent: '#7C3AED',
          error: '#DC2626',
          info: '#0284C7',
          success: '#059669',
          warning: '#D97706',
          background: '#F6F8FC',
          surface: '#FFFFFF',
          'surface-variant': '#EEF2F7',
          'on-background': '#15213A',
          'on-surface': '#15213A',
        },
        variables: {
          'border-color': '#CBD5E1',
          'border-opacity': 0.72,
          'high-emphasis-opacity': 0.92,
          'medium-emphasis-opacity': 0.68,
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#60A5FA',
          secondary: '#5EEAD4',
          accent: '#A78BFA',
          error: '#FB7185',
          info: '#38BDF8',
          success: '#34D399',
          warning: '#FBBF24',
          background: '#0B1120',
          surface: '#111A2E',
          'surface-variant': '#1A2740',
          'on-background': '#E8EEF8',
          'on-surface': '#E8EEF8',
        },
        variables: {
          'border-color': '#475569',
          'border-opacity': 0.48,
          'high-emphasis-opacity': 0.94,
          'medium-emphasis-opacity': 0.72,
        },
      },
    },
  },
})

// Create the app
const app = createApp(App)

// Add Pinia store
const pinia = createPinia()
app.use(pinia)
supabase?.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') void router.replace('/reset-password')
  if (event === 'SIGNED_OUT') {
    useFinanceStore(pinia).reset()
    void router.replace('/login')
  }
})

// Add router
app.use(router)

// Add Vuetify
app.use(vuetify)

// Mount the app
app.mount('#app')

setupAppInstall()
