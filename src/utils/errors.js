export class UserFacingError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UserFacingError'
  }
}

const authMessages = {
  invalid_credentials: 'The email or password is incorrect.',
  email_not_confirmed: 'Confirm your email address before signing in.',
  user_already_exists: 'An account already exists for this email address.',
  over_email_send_rate_limit: 'Too many email requests. Wait a few minutes and try again.',
  over_request_rate_limit: 'Too many requests. Wait a few minutes and try again.',
  weak_password: 'Choose a stronger password and try again.',
}

export function authErrorMessage(error, fallback = 'Authentication failed. Please try again.') {
  if (!error) return fallback
  if (error instanceof UserFacingError) return error.message
  return authMessages[error.code] || fallback
}

export function financeErrorMessage(error) {
  if (error instanceof UserFacingError) return error.message
  const message = String(error?.message || '')
  if (message.includes('finance_state') || ['PGRST205', '42P01'].includes(error?.code)) {
    return 'FinTrack’s database is not ready. Run supabase/schema.sql, then reload your data.'
  }
  if (error?.status === 401 || error?.code === 'PGRST301') {
    return 'Your session expired. Sign in again.'
  }
  return 'FinTrack could not sync your changes. Check your connection and try again.'
}
