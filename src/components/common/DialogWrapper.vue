<script setup>
defineProps({
  modelValue: Boolean,
  title: String,
})
</script>

<template>
  <v-dialog
    persistent
    max-width="500"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="text-h6">{{ title }}</v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions>
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

