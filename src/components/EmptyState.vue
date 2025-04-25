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
  <v-sheet class="pa-12 d-flex flex-column align-center">
    <v-icon :size="iconSize" :color="iconColor" class="mb-4">{{ icon }}</v-icon>
    <h3 class="text-h5 mb-2">{{ title }}</h3>
    <p class="text-body-1 text-medium-emphasis text-center mb-6">
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

