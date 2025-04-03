<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();

onMounted(() => {
  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'system';
  
  if (savedTheme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme.global.name.value = prefersDark ? 'dark' : 'light';
  } else {
    theme.global.name.value = savedTheme;
  }
});
</script>