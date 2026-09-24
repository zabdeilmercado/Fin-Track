<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import AppLayout from '@/components/layout/AppLayout.vue'
import { passwordValidator } from '@/utils/validators'
const router = useRouter()
const form = ref(null)
const password = ref('')
const confirmation = ref('')
const error = ref('')
const loading = ref(false)
const available = ref(false)
onMounted(async () => {
  available.value = !!(await supabase?.auth.getSession())?.data.session
  if (!available.value)
    error.value = 'Open the password-reset link from your email to set a new password.'
})
const save = async () => {
  if (loading.value || !available.value || !(await form.value.validate()).valid) return
  loading.value = true
  error.value = ''
  try {
    const { error: saveError } = await supabase.auth.updateUser({ password: password.value })
    if (saveError) throw saveError
    password.value = ''
    confirmation.value = ''
    await supabase.auth.signOut()
    await router.replace({ name: 'login', query: { reset: 'success' } })
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <AppLayout
    title="New password"
    subtitle="Choose a new password for your FinTrack account"
    buttonText="Save password"
    :loading="loading"
    @submit="save"
  >
    <template #form-fields
      ><v-form ref="form" @submit.prevent="save"
        ><v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert
        ><v-text-field
          v-model="password"
          type="password"
          autocomplete="new-password"
          label="New password"
          :disabled="!available"
          :rules="[passwordValidator]" /><v-text-field
          v-model="confirmation"
          type="password"
          autocomplete="new-password"
          label="Confirm new password"
          :disabled="!available"
          :rules="[(v) => (!!v && v === password) || 'Passwords must match']" /></v-form
    ></template>
    <template #footer-links><v-btn to="/login" variant="text">Back to sign in</v-btn></template>
  </AppLayout>
</template>
