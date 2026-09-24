export function reportError(context, error) {
  if (!import.meta.env.DEV || import.meta.env.MODE === 'test') return
  const safeError = error instanceof Error ? `${error.name}: ${error.message}` : String(error)
  console.error(`[FinTrack] ${context}: ${safeError}`)
}
