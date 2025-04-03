<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

const rules = {
  required: (value) => !!value || 'Required.',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email.',
  password: (value) => value.length >= 8 || 'Password must be at least 8 characters.',
}

const passwordMatchRule = (value) => value === password.value || 'Passwords do not match.'

const handleSubmit = async () => {
  loading.value = true
  try {
    console.log('Registering:', { name: name.value, email: email.value, password: password.value })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push('/dashboard')
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <AppLayout
    title="Create an account"
    subtitle="Enter your information to get started"
    buttonText="Create account"
    :loading="loading"
    @submit="handleSubmit"
  >
    <template #form-fields>
      <v-text-field
        v-model="name"
        label="Full Name"
        placeholder="John Doe"
        variant="outlined"
        required
        prepend-inner-icon="mdi-account-outline"
        :rules="[rules.required]"
      >
      </v-text-field>

      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        placeholder="name@example.com"
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
        :rules="[rules.required, rules.password]"
      >
      </v-text-field>

      <v-text-field
        v-model="confirmPassword"
        label="Confirm Password"
        :type="showConfirmPassword ? 'text' : 'password'"
        variant="outlined"
        required
        prepend-inner-icon="mdi-lock-check-outline"
        :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showConfirmPassword = !showConfirmPassword"
        :rules="[rules.required, passwordMatchRule]"
      >
      </v-text-field>
    </template>

    <template #footer-links>
      Already have an account?
      <v-btn variant="text" color="primary" to="/login">Sign in</v-btn>
    </template>
  </AppLayout>
</template>
