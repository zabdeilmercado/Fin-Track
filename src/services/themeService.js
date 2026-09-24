import { computed } from 'vue'
import { useTheme } from 'vuetify'

export function useThemeService() {
  const theme = useTheme()
  const isDarkTheme = computed(() => theme.global.current.value.dark)
  const toggleTheme = () => {
    theme.global.name.value = isDarkTheme.value ? 'light' : 'dark'
    localStorage.setItem('theme', theme.global.name.value)
  }
  return { isDarkTheme, toggleTheme }
}
