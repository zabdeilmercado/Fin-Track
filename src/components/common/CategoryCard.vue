<script setup>
defineProps({
  icon: String,
  title: String,
  description: String,
  progress: Number,
})
</script>

<template>
  <v-card class="pa-4 d-flex flex-column justify-space-between h-100">
    <div>
      <v-icon class="mb-2">{{ icon }}</v-icon>
      <h3 class="text-subtitle-1 font-weight-medium">{{ title }}</h3>
      <p class="text-body-2 text-medium-emphasis">{{ description }}</p>
    </div>
    <div>
      <v-progress-linear :model-value="progress" color="primary" height="6" class="mb-3" />
      <v-btn icon @click="$emit('edit')">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon @click="$emit('delete')">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

