<script setup>
import { ref, computed } from 'vue'
import { useThemeService } from '@/services/themeService'
import { online } from '@/services/appInstall'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { supabase } from '@/utils/supabase'
import { useFinanceStore } from '@/stores/finance'
import { authErrorMessage } from '@/utils/errors'
import { reportError } from '@/utils/logger'

const financeStore = useFinanceStore()
const router = useRouter()
const { mobile } = useDisplay()
const logoutError = ref('')
const drawer = ref(!mobile.value)

const props = defineProps({
  pageTitle: { type: String, required: true },
  activeItem: { type: String, required: true },
})

const themeService = useThemeService()
const isDarkTheme = computed(() => themeService.isDarkTheme.value)
const toggleTheme = themeService.toggleTheme

const menuItems = [
  { title: 'Overview', icon: 'mdi-view-dashboard-outline', value: 'dashboard', to: '/dashboard' },
  { title: 'Transactions', icon: 'mdi-swap-horizontal', value: 'transaction', to: '/transaction' },
  { title: 'Budgets', icon: 'mdi-chart-donut', value: 'budgets', to: '/budgets' },
  { title: 'Savings goals', icon: 'mdi-piggy-bank-outline', value: 'savings', to: '/savings' },
  { title: 'Categories', icon: 'mdi-tag-outline', value: 'categories', to: '/categories' },
  { title: 'Settings', icon: 'mdi-cog-outline', value: 'settings', to: '/settings' },
]

const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    reportError('Sign out', error)
    logoutError.value = authErrorMessage(error, 'Could not sign out. Please try again.')
    return
  }
  financeStore.reset()
  await router.replace('/login')
}
</script>

<template>
  <v-layout class="app-shell">
    <v-navigation-drawer
      v-model="drawer"
      :permanent="!mobile"
      :temporary="mobile"
      :width="252"
      color="surface"
      class="app-sidebar"
    >
      <div class="brand">
        <div class="brand-mark" aria-hidden="true"><v-icon size="23">mdi-finance</v-icon></div>
        <div>
          <div class="brand-name">FinTrack</div>
          <div class="brand-caption">Personal finance</div>
        </div>
      </div>

      <div class="nav-label">Workspace</div>
      <v-list nav class="nav-list">
        <v-list-item
          v-for="item in menuItems"
          :key="item.value"
          :value="item.value"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          :active="item.value === props.activeItem"
          color="primary"
          class="nav-item"
        />
      </v-list>

      <template #append>
        <div class="sidebar-footer">
          <div class="sync-state">
            <span class="sync-dot" :class="{ offline: !online }"></span>
            <span>{{ online ? (financeStore.isSaving ? 'Saving changes…' : 'Cloud sync ready') : 'You’re offline' }}</span>
          </div>
          <v-btn block variant="text" prepend-icon="mdi-logout-variant" class="logout-btn" @click="logout">
            Sign out
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main class="main-area">
      <v-app-bar color="background" flat class="top-bar">
        <v-app-bar-nav-icon v-if="mobile" aria-label="Open navigation" @click="drawer = !drawer" />
        <v-app-bar-title class="top-title">{{ props.pageTitle }}</v-app-bar-title>
        <v-spacer />
        <v-tooltip :text="isDarkTheme ? 'Use light theme' : 'Use dark theme'" location="bottom">
          <template #activator="{ props: tooltipProps }">
            <v-btn v-bind="tooltipProps" icon variant="text" size="small" aria-label="Toggle color theme" @click="toggleTheme">
              <v-icon>{{ isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        <v-menu location="bottom end">
          <template #activator="{ props: menuProps }">
            <v-btn v-bind="menuProps" icon variant="text" size="small" class="ml-1" aria-label="Account menu">
              <v-avatar color="primary" variant="tonal" size="32"><v-icon size="19">mdi-account</v-icon></v-avatar>
            </v-btn>
          </template>
          <v-list min-width="180">
            <v-list-item prepend-icon="mdi-logout-variant" title="Sign out" @click="logout" />
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-container fluid class="page-container">
        <v-alert v-if="financeStore.error || logoutError" type="error" variant="tonal" closable class="mb-4" role="alert">
          {{ financeStore.error || logoutError }}
          <template #append><v-btn variant="text" @click="financeStore.init(true)">Reload</v-btn></template>
        </v-alert>
        <v-progress-linear
          v-if="financeStore.isLoading || financeStore.isSaving"
          indeterminate
          color="primary"
          class="global-progress"
          aria-label="Loading or saving finances"
        />
        <v-alert v-if="!online" type="warning" variant="tonal" class="mb-4">
          You are offline. Keep any unsaved form open and reconnect before saving.
        </v-alert>
        <slot />
      </v-container>
    </v-main>
  </v-layout>
</template>

<style scoped>
.app-shell { min-height: 100vh; background: rgb(var(--v-theme-background)); }
.app-sidebar { position: fixed !important; top: 0 !important; height: 100vh !important; border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important; }
.brand { height: 76px; display: flex; align-items: center; gap: 12px; padding: 0 20px; }
.brand-mark { width: 38px; height: 38px; display: grid; place-items: center; color: white; background: linear-gradient(145deg, #2563eb, #0f766e); border-radius: 12px; box-shadow: 0 8px 18px rgba(37, 99, 235, .2); }
.brand-name { font-size: 1.05rem; font-weight: 750; letter-spacing: -.03em; line-height: 1.2; }
.brand-caption { color: rgba(var(--v-theme-on-surface), .55); font-size: .72rem; }
.nav-label { padding: 18px 22px 7px; color: rgba(var(--v-theme-on-surface), .48); font-size: .68rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
.nav-list { padding: 4px 12px; }
.nav-item { min-height: 44px; margin-bottom: 4px; color: rgba(var(--v-theme-on-surface), .7); font-weight: 600; }
.nav-item.v-list-item--active { background: rgba(var(--v-theme-primary), .1); color: rgb(var(--v-theme-primary)); }
.sidebar-footer { padding: 14px 14px 18px; border-top: 1px solid rgba(var(--v-border-color), .45); }
.sync-state { display: flex; align-items: center; gap: 8px; padding: 8px 10px 12px; color: rgba(var(--v-theme-on-surface), .6); font-size: .76rem; }
.sync-dot { width: 8px; height: 8px; border-radius: 50%; background: rgb(var(--v-theme-success)); box-shadow: 0 0 0 4px rgba(var(--v-theme-success), .12); }
.sync-dot.offline { background: rgb(var(--v-theme-warning)); box-shadow: 0 0 0 4px rgba(var(--v-theme-warning), .12); }
.logout-btn { justify-content: flex-start; color: rgba(var(--v-theme-on-surface), .65); }
.main-area { min-height: 100vh; }
.top-bar { border-bottom: 1px solid rgba(var(--v-border-color), .38); }
.top-title { font-size: .95rem; font-weight: 650; }
.page-container { max-width: 1380px; padding: 28px 32px 56px; }
.global-progress { position: fixed; top: 64px; left: 0; z-index: 1007; }
@media (max-width: 959px) { .page-container { padding: 22px 20px 44px; } }
@media (max-width: 599px) { .page-container { padding: 18px 14px 40px; } .top-title { font-size: .9rem; } }
</style>
