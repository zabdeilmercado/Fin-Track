<script setup>
defineProps({
  title: String,
  subtitle: String,
})
</script>

<template>
  <v-container fluid>
    <v-row class="align-center justify-space-between mb-4">
      <div>
        <h1 class="text-h5 font-weight-bold">{{ title }}</h1>
        <p class="text-body-2 text-medium-emphasis" v-if="subtitle">{{ subtitle }}</p>
      </div>
      <slot name="action" />
    </v-row>
    <slot />
  </v-container>
</template>

