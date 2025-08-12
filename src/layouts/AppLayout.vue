<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <NavBar />

    <!-- Kontent qismi -->
    <div class="flex-1">
      <!-- Asosiy kontent -->
      <main class="p-4 bg-gray-50 min-h-full">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/Nav/NavBar.vue'
</script>

<style scoped>
/* Sidebar uchun animatsiyalar endi kerak emas, olib tashlashing mumkin */
</style>
