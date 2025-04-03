<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)

const rules = {
  required: (value) => !!value || 'Required.',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email.',
}

const handleSubmit = async () => {
  loading.value = true
  try {
    console.log('Logging in:', { email: email.value, password: password.value })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push('/dashboard')
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
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        variant="outlined"
        required
        prepend-inner-icon="mdi-email-outline"
        :rules="[rules.required, rules.email]"
      >
      </v-text-field>

      <v-text-field
        v-model="password"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        variant="outlined"
        required
        prepend-inner-icon="mdi-lock-outline"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
      >
      </v-text-field>

      <v-checkbox v-model="rememberMe" label="Remember me" color="primary" hide-details>
      </v-checkbox>
    </template>

    <template #footer-links>
      <v-btn variant="text" color="primary" to="/register">Create an account</v-btn>
    </template>
  </AppLayout>
</template>
