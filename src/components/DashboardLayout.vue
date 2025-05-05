<script setup>
import { ref, computed } from 'vue'
import { useThemeService } from '@/services/themeService'
import { onMounted } from 'vue'

const props = defineProps({
  pageTitle: {
    type: String,
    required: true,
  },
  activeItem: {
    type: String,
    required: true,
  },
})

// Theme toggle
const themeService = useThemeService()
const isDarkTheme = computed(() => themeService.isDarkTheme.value)
const toggleTheme = themeService.toggleTheme

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
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', value: 'dashboard', to: '/dashboard' },
  { title: 'Transactions', icon: 'mdi-wallet-outline', value: 'transaction', to: '/transaction' },
  { title: 'Categories', icon: 'mdi-tag-outline', value: 'categories', to: '/categories' },
]
</script>

<template>
  <v-app>
    <!-- App Layout with Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="!sidebarExpanded"
      permanent
      :elevation="2"
      position="fixed"
      color="background"
      class="border-r sidebar-hover"
      @mouseenter="expandSidebar"
      @mouseleave="collapseSidebar"
      fixed-sidebar
    >
      <v-list-item
        prepend-icon="mdi-wallet-outline"
        :title="sidebarExpanded ? 'FinTrack' : ''"
        class="py-3"
      ></v-list-item>

      <v-divider></v-divider>

      <v-list nav density="compact">
        <v-list-item
          v-for="item in menuItems"
          :key="item.value"
          :value="item.value"
          :prepend-icon="item.icon"
          :title="sidebarExpanded ? item.title : ''"
          :to="item.to"
          rounded="lg"
          class="mb-1"
          :active="item.value === activeItem"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <!-- App Bar -->
      <v-app-bar color="background" flat>
        <v-app-bar-nav-icon @click="drawer = !drawer" class="d-flex d-sm-none"></v-app-bar-nav-icon>
        <v-app-bar-title class="text-h6 font-weight-bold">{{ pageTitle }}</v-app-bar-title>
        <v-spacer></v-spacer>

        <v-btn icon class="mr-2" size="small" @click="toggleTheme">
          <v-icon>{{ isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>

        <v-menu location="bottom end">
  <template v-slot:activator="{ props }">
    <v-avatar size="32" class="ml-2 cursor-pointer" v-bind="props">
      <v-img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User"></v-img>
    </v-avatar>
  </template>
  <v-list>
    <v-list-item @click="$router.push('/settings')">
      <v-list-item-title>Settings</v-list-item-title>
    </v-list-item>

    <v-divider></v-divider>

    <v-list-item @click="$router.push('/login')">
      <v-list-item-title>Logout</v-list-item-title>
    </v-list-item>
  </v-list>
</v-menu>

      </v-app-bar>

      <!-- Page Content -->
      <v-container fluid class="pa-6">
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-navigation-drawer.border-r {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}

.sidebar-hover {
  transition: width 0.3s ease;
}

.cursor-pointer {
  cursor: pointer;
}

.fixed-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow: hidden;
}
</style>
