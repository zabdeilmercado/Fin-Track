import { computed, ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'

// Create a singleton instance
let themeInstance = null

export function useThemeService() {
  // Return the existing instance if it exists
  if (themeInstance) return themeInstance

  const theme = useTheme()
  const isDarkTheme = computed(() => theme.global.current.value.dark)
  const themeName = ref(localStorage.getItem('theme') || 'light')

  const toggleTheme = () => {
    themeName.value = isDarkTheme.value ? 'light' : 'dark'
    theme.global.name.value = themeName.value
    localStorage.setItem('theme', themeName.value)
  }

  const initTheme = () => {
    theme.global.name.value = themeName.value
  }

  onMounted(() => {
    initTheme()
  })

  // Create the singleton instance
  themeInstance = {
    isDarkTheme,
    toggleTheme,
    initTheme,
  }

  return themeInstance
}
