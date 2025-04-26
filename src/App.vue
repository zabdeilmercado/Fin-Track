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

<template>
  <v-app>
    <v-main>
      <router-view :key="$route.fullPath"/>
    </v-main>
  </v-app>
</template>

