<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../layout/AppLayout.vue'
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '../../utils/validators'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const isValid = ref(false)

const rules = {
  required: requiredValidator,
  email: emailValidator,
  password: passwordValidator,
}

const passwordMatchRule = (value) => confirmedValidator(value, password.value)

const handleSubmit = async () => {
  loading.value = true
  try {
    // Check if the form is valid before submitting
    if (isValid.value) {
      console.log('Registering:', {
        name: name.value,
        email: email.value,
        password: password.value,
      })
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push('/dashboard')
    } else {
      console.log('Form is invalid.')
    }
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
      <v-form v-model="isValid">
        <v-text-field
          v-model="name"
          label="Full Name"
          placeholder="John Doe"
          variant="outlined"
          required
          prepend-inner-icon="mdi-account-outline"
          :rules="[rules.required]"
        />

        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
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
          :rules="[rules.required, rules.password]"
        />

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
        />
      </v-form>
    </template>

    <template #footer-links>
      Already have an account?
      <v-btn variant="text" color="primary" to="/login">Sign in</v-btn>
    </template>
  </AppLayout>
</template>
