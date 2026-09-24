import { supabase, formActionDefault } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { authErrorMessage } from '@/utils/errors'
import { reportError } from '@/utils/logger'

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
          },
        },
      })

      if (error) {
        formAction.value.formErrorMessage = authErrorMessage(error, 'Account creation failed. Try again.')
        formAction.value.formStatus = error.status
        return false
      } else if (data) {
        formAction.value.formSuccessMessage = data.session
          ? 'Account created.'
          : 'Check your email to confirm your account, then sign in.'
        if (data.session) await router.replace('/dashboard')
        refVForm.value?.reset()
        return true
      }
    } catch (err) {
      reportError('Registration', err)
      formAction.value.formErrorMessage = authErrorMessage(
        err,
        'Account creation failed. Try again.',
      )
      return false
    } finally {
      formAction.value.formProcess = false
    }
  }

  const onFormSubmit = async () => {
    const result = await refVForm.value?.validate()
    return result?.valid ? onSubmit() : false
  }

  return { formData, formAction, refVForm, onFormSubmit }
}
