import { createClient } from '@supabase/supabase-js'

const projectUrl = import.meta.env.VITE_SUPABASE_URL
const publicKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
let client = null
try {
  if (projectUrl && publicKey) client = createClient(projectUrl, publicKey)
} catch {
  // Keep the setup screen usable when environment values are incomplete or invalid.
  client = null
}
export const supabase = client
export const formActionDefault = {
  formProcess: false,
  formStatus: 200,
  formErrorMessage: '',
  formSuccessMessage: '',
}
