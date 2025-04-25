import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useThemeService } from '@/services/themeService'

export const useAppStore = defineStore('app', () => {
  const themeService = useThemeService()

  // Sidebar state
  const drawer = ref(true)
  const sidebarExpanded = ref(false) // Start collapsed by default

  // Sidebar hover functions
  const expandSidebar = () => {
    sidebarExpanded.value = true
  }

  const collapseSidebar = () => {
    sidebarExpanded.value = false
  }

  // Menu items
  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'mdi-view-dashboard-outline',
      value: 'dashboard',
      to: '/dashboard',
    },
    {
      title: 'Transactions',
      icon: 'mdi-wallet-outline',
      value: 'transactions',
      to: '/transactions',
    },
    { title: 'Categories', icon: 'mdi-tag-outline', value: 'categories', to: '/categories' },
    { title: 'Budget', icon: 'mdi-chart-pie', value: 'budget', to: '/budget' },
    { title: 'Reports', icon: 'mdi-file-chart-outline', value: 'reports', to: '/reports' },
  ]

  return {
    // Theme
    isDarkTheme: themeService.isDarkTheme,
    toggleTheme: themeService.toggleTheme,
    initTheme: themeService.initTheme,

    // Sidebar
    drawer,
    sidebarExpanded,
    expandSidebar,
    collapseSidebar,

    // Navigation
    menuItems,
  }
})
