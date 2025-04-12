import { supabase, formActionDefault } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export function useRegister() {
  const router = useRouter()

  const formDataDefault = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  }

  const formData = ref({
    ...formDataDefault
  })

  const formAction = ref({
    ...formActionDefault
  })

  const refVForm = ref()

  const onSubmit = async () => {
    formAction.value = { ...formActionDefault, formProcess: true }

    const { data, error } = await supabase.auth.signUp({
      email: formData.value.email,
      password: formData.value.password,
      options: {
        data: {
          name: formData.value.name,
          is_admin: false
        }
      }
    })

    if (error) {
      formAction.value.formErrorMessage = error.message
      formAction.value.formStatus = error.status
    } else if (data) {
      formAction.value.formSuccessMessage = 'Successfully Registered Account.'
      router.replace('/dashboard')
    }

    refVForm.value?.reset()
    formAction.value.formProcess = false
  }

  const onFormSubmit = () => {
    refVForm.value?.validate().then(({ valid }) => {
      if (valid) onSubmit()
    })
  }

  return { formData, formAction, refVForm, onFormSubmit }
}
