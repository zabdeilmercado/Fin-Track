const empty = (value) =>
  value === null ||
  value === undefined ||
  value === '' ||
  (Array.isArray(value) && value.length === 0)

export const requiredValidator = (value) =>
  (!empty(value) && value !== false && String(value).trim().length > 0) ||
  'This field is required'

export const emailValidator = (value) => {
  if (empty(value)) return true
  const email = String(value).trim()
  return (
    (email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
    'Enter a valid email address'
  )
}

export const passwordValidator = (password) =>
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,128}$/.test(String(password ?? '')) ||
  'Use 8–128 characters with uppercase, lowercase, a number, and a special character.'

export const confirmedValidator = (value, target) =>
  value === target || 'Passwords do not match'
