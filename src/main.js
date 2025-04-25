import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify setup
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#7C3AED',
          secondary: '#8B5CF6',
          background: '#F9FAFB',
          surface: '#FFFFFF',
          error: '#EF4444',
          success: '#10B981',
          warning: '#F59E0B',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#8B5CF6',
          secondary: '#A78BFA',
          background: '#111827',
          surface: '#1F2937',
          error: '#F87171',
          success: '#34D399',
          warning: '#FBBF24',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
