<script setup>
import { useThemeService } from '@/services/themeService'
import { computed, onMounted } from 'vue'

const themeService = useThemeService()
const isDarkTheme = computed(() => themeService.isDarkTheme.value)
const toggleTheme = themeService.toggleTheme

defineProps({
  title: String,
  subtitle: String,
  buttonText: String,
  loading: Boolean,
})

defineEmits(['submit'])
</script>

<template>
  <v-container fluid class="fill-height bg-surface">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="mx-auto pa-4" elevation="8" rounded="lg">
          <v-card-title class="text-center text-h4 font-weight-bold">
            {{ title }}
          </v-card-title>
          <v-card-subtitle class="text-center pb-4">
            {{ subtitle }}
          </v-card-subtitle>

          <v-form @submit.prevent="$emit('submit')">
            <v-card-text>
              <slot name="form-fields"></slot>
            </v-card-text>

            <v-card-actions class="flex-column">
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                class="mb-4"
                :loading="loading"
              >
                {{ buttonText }}
              </v-btn>

              <div class="text-center text-body-2">
                <slot name="footer-links"></slot>
              </div>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Theme toggle button -->
    <v-btn icon variant="text" class="theme-toggle" @click="toggleTheme">
      <v-icon>{{ isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>
  </v-container>
</template>

<style scoped>
.theme-toggle {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
}
</style>
