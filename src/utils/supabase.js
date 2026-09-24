import { createClient } from '@supabase/supabase-js'

const projectUrl = import.meta.env.VITE_SUPABASE_URL
const publicKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

function isAllowedUrl(value) {
  try {
    const url = new URL(value)
    const localDevelopment =
      import.meta.env.DEV && ['localhost', '127.0.0.1'].includes(url.hostname)
    return (url.protocol === 'https:' && url.hostname.endsWith('.supabase.co')) || localDevelopment
  } catch {
    return false
  }
}

function isPublicKey(value) {
  if (typeof value !== 'string' || value.length < 20 || value.startsWith('sb_secret_')) return false
  if (!value.startsWith('eyJ')) return value.startsWith('sb_publishable_')
  try {
    const encoded = value.split('.')[1].replaceAll('-', '+').replaceAll('_', '/')
    const payload = JSON.parse(atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '=')))
    return payload.role === 'anon'
  } catch {
    return false
  }
}

export const supabaseConfigError =
  !isAllowedUrl(projectUrl) || !isPublicKey(publicKey)
    ? 'FinTrack requires a valid Supabase URL and public publishable key.'
    : ''

export const supabase = supabaseConfigError
  ? null
  : createClient(projectUrl, publicKey, {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })

export const formActionDefault = {
  formProcess: false,
  formStatus: 200,
  formErrorMessage: '',
  formSuccessMessage: '',
}
