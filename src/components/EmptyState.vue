<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  iconColor: {
    type: String,
    default: 'primary',
  },
  iconSize: {
    type: [Number, String],
    default: 64,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  actionText: {
    type: String,
    default: '',
  },
  actionIcon: {
    type: String,
    default: '',
  },
  actionColor: {
    type: String,
    default: 'primary',
  },
})

defineEmits(['action'])
</script>

<template>
  <v-sheet color="transparent" class="empty-state d-flex flex-column align-center">
    <div class="empty-icon mb-4">
      <v-icon :size="Math.min(Number(iconSize), 42)" :color="iconColor">{{ icon }}</v-icon>
    </div>
    <h3 class="section-heading mb-2">{{ title }}</h3>
    <p class="text-body-2 text-medium-emphasis text-center mb-5">
      {{ description }}
    </p>
    <v-btn
      v-if="actionText"
      :color="actionColor"
      :prepend-icon="actionIcon"
      @click="$emit('action')"
    >
      {{ actionText }}
    </v-btn>
  </v-sheet>
</template>

<style scoped>
.empty-state { padding: 44px 24px; }
.empty-state p { max-width: 430px; }
.empty-icon { width: 72px; height: 72px; display: grid; place-items: center; border-radius: 22px; background: rgba(var(--v-theme-primary), .09); }
@media (max-width: 599px) { .empty-state { padding: 34px 18px; } }
</style>

