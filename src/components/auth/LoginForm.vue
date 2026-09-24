<script setup>
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { requiredValidator, emailValidator } from '@/utils/validators'

const router = useRouter()
const route = useRoute()
const notice = ref(
  route.query.reset === 'success' ? 'Password updated. Sign in with your new password.' : '',
)
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const form = ref(null)
const showPassword = ref(false)
const loading = ref(false)
const isValid = ref(false)

const rules = {
  required: requiredValidator,
  email: emailValidator,
}

const handleSubmit = async () => {
  if (loading.value) return
  const result = await form.value.validate()
  if (!result.valid) return
  loading.value = true
  errorMessage.value = ''
  try {
    if (!supabase)
      throw new Error('Supabase is not configured. Set the deployment environment variables.')
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value.trim(),
      password: password.value,
    })
    if (error) throw error
    password.value = ''
    await router.replace('/dashboard')
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    loading.value = false
  }
}
const resetPassword = async () => {
  if (loading.value) return
  if (!email.value || emailValidator(email.value) !== true) {
    errorMessage.value = 'Enter your email above first.'
    return
  }
  loading.value = true
  errorMessage.value = ''
  notice.value = ''
  try {
    if (!supabase) throw new Error('Supabase is not configured.')
    const { error } = await supabase.auth.resetPasswordForEmail(email.value.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
    notice.value = 'If this email has an account, you will receive a password-reset link.'
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppLayout
    title="Welcome back"
    subtitle="Sign in to your account to continue"
    buttonText="Sign in"
    :loading="loading"
    @submit="handleSubmit"
  >
    <template #form-fields>
      <v-form ref="form" v-model="isValid" @submit.prevent="handleSubmit">
        <v-alert v-if="notice" type="success" class="mb-4">{{ notice }}</v-alert>
        <v-alert v-if="errorMessage" type="error" class="mb-4">{{ errorMessage }}</v-alert>
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          variant="outlined"
          required
          prepend-inner-icon="mdi-email-outline"
          :rules="[rules.required, rules.email]"
        />

        <v-text-field
          v-model="password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          required
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          :rules="[rules.required]"
        />
        <v-btn variant="text" :disabled="loading" @click="resetPassword">Forgot password?</v-btn>
      </v-form>
    </template>

    <template #footer-links>
      Don't have an account?
      <v-btn variant="text" color="primary" to="/register">Create an account</v-btn>
    </template>
  </AppLayout>
</template>
