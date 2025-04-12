import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia';
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

// Create router
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('./views/auth/LoginView.vue') },
  { path: '/register', component: () => import('./views/auth/RegisterView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia();

// Vuetify instance
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


const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(vuetify);
app.mount('#app');
