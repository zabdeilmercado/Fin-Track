import { supabase, formActionDefault } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export function useRegister() {
  const router = useRouter()

  const formDataDefault = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  }

  const formData = ref({
    ...formDataDefault,
  })

  const formAction = ref({
    ...formActionDefault,
  })

  const refVForm = ref()

  const onSubmit = async () => {
    if (formAction.value.formProcess) return
    formAction.value = { ...formActionDefault, formProcess: true }

    try {
      if (!supabase)
        throw new Error('Supabase is not configured. Set the deployment environment variables.')
      const { data, error } = await supabase.auth.signUp({
        email: formData.value.email,
        password: formData.value.password,
        options: {
          data: {
            name: formData.value.name,
            is_admin: false,
          },
        },
      })

      if (error) {
        formAction.value.formErrorMessage = error.message
        formAction.value.formStatus = error.status
      } else if (data) {
        formAction.value.formSuccessMessage = data.session
          ? 'Account created.'
          : 'Check your email to confirm your account, then sign in.'
        if (data.session) await router.replace('/dashboard')
        refVForm.value?.reset()
      }
    } catch (err) {
      console.error('[Unhandled Error in onSubmit]:', err)
      formAction.value.formErrorMessage = err.message || 'Unexpected error occurred.'
    } finally {
      formAction.value.formProcess = false
    }
  }

  const onFormSubmit = () => {
    refVForm.value?.validate().then(({ valid }) => {
      if (valid) onSubmit()
    })
  }

  return { formData, formAction, refVForm, onFormSubmit }
}
