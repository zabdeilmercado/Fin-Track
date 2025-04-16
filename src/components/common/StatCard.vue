<script setup>
defineProps({
  title: String,
  value: String,
  icon: String,
  color: String,
})
</script>

<template>
  <v-card class="pa-4 d-flex align-center">
    <v-icon size="36" class="mr-4" :color="color">{{ icon }}</v-icon>
    <div>
      <div class="text-caption text-medium-emphasis">{{ title }}</div>
      <div class="text-h6 font-weight-bold">{{ value }}</div>
    </div>
  </v-card>
</template>

