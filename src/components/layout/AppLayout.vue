<script setup>
import { useThemeService } from '@/services/themeService'
import { computed } from 'vue'

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
  <v-container fluid class="auth-shell fill-height" style="min-height: 100vh">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <div class="auth-brand mb-6"><div class="auth-mark"><v-icon>mdi-finance</v-icon></div><span>FinTrack</span></div>
        <v-card class="auth-card mx-auto pa-3 pa-sm-5">
          <v-card-title class="text-center page-heading pt-5">
            {{ title }}
          </v-card-title>
          <v-card-subtitle class="text-center pb-4">
            {{ subtitle }}
          </v-card-subtitle>

          <div>
            <v-card-text>
              <slot name="form-fields"></slot>
            </v-card-text>

            <v-card-actions class="flex-column">
              <v-btn
                @click="$emit('submit')"
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
          </div>
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
.auth-shell { position: relative; background: radial-gradient(circle at 10% 5%, rgba(var(--v-theme-primary), .14), transparent 30%), radial-gradient(circle at 90% 95%, rgba(var(--v-theme-secondary), .12), transparent 30%), rgb(var(--v-theme-background)); }
.auth-brand { display: flex; justify-content: center; align-items: center; gap: 10px; font-size: 1.1rem; font-weight: 750; letter-spacing: -.03em; }
.auth-mark { width: 36px; height: 36px; display: grid; place-items: center; color: white; background: linear-gradient(145deg, #2563eb, #0f766e); border-radius: 11px; }
.auth-card { box-shadow: var(--ft-shadow-md) !important; }
.theme-toggle {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
}
</style>
