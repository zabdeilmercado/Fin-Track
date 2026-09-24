<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { useRegister } from '@/composables/auth/register'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { formData, formAction, refVForm, onFormSubmit } = useRegister()
const router = useRouter()

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const rules = {
  required: requiredValidator,
  email: emailValidator,
  password: passwordValidator,
}

const passwordMatchRule = (value) => confirmedValidator(value, formData.value.password)

const handleFormSubmit = async () => {
  const success = await onFormSubmit()
  if (success) {
    router.push('/dashboard') // Redirect to the dashboard on success
  }
}
</script>

<template>
  <AppLayout
    title="Create an account"
    subtitle="Enter your information to get started"
    buttonText="Create account"
    :loading="formAction.formProcess"
    @submit="handleFormSubmit"
  >
    <template #form-fields>
      <v-form ref="refVForm" @submit.prevent="handleFormSubmit">
        <AlertNotification
          :formSuccessMessage="formAction.formSuccessMessage"
          :formErrorMessage="formAction.formErrorMessage"
        />

        <v-text-field
          v-model="formData.name"
          label="Full Name"
          placeholder="John Doe"
          variant="outlined"
          required
          prepend-inner-icon="mdi-account-outline"
          :rules="[rules.required]"
        />

        <v-text-field
          v-model="formData.email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          variant="outlined"
          required
          prepend-inner-icon="mdi-email-outline"
          :rules="[rules.required, rules.email]"
        />

        <v-text-field
          v-model="formData.password"
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
          v-model="formData.password_confirmation"
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
