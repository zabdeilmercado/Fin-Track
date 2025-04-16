// src/composables/useDarkMode.js
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'

export function useDarkMode() {
  const theme = useTheme()
  const isDark = ref(theme.global.name.value === 'dark')

  const toggleTheme = () => {
    const newTheme = isDark.value ? 'light' : 'dark'
    theme.global.name.value = newTheme
    isDark.value = newTheme === 'dark'
    localStorage.setItem('theme', newTheme)
  }

  onMounted(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      theme.global.name.value = storedTheme
      isDark.value = storedTheme === 'dark'
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const defaultTheme = prefersDark ? 'dark' : 'light'
      theme.global.name.value = defaultTheme
      isDark.value = defaultTheme === 'dark'
    }
  })

  return { isDark, toggleTheme }
}
