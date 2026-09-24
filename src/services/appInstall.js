import { ref } from 'vue'
export const installPrompt = ref(null)
export const appInstalled = ref(false)
export const online = ref(typeof navigator === 'undefined' ? true : navigator.onLine)

export function setupAppInstall() {
  appInstalled.value = window.matchMedia('(display-mode: standalone)').matches
  window.addEventListener('online', () => {
    online.value = true
  })
  window.addEventListener('offline', () => {
    online.value = false
  })
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    installPrompt.value = event
  })
  window.addEventListener('appinstalled', () => {
    appInstalled.value = true
    installPrompt.value = null
  })
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => navigator.serviceWorker.ready)
      .catch(() => {})
  }
}
export async function installApp() {
  if (!installPrompt.value) return
  const prompt = installPrompt.value
  try {
    await prompt.prompt()
    await prompt.userChoice
  } finally {
    installPrompt.value = null
  }
}
