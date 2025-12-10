<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Overlay (faqat mobil sidebar ochilganda) -->
    <div
      v-if="!sidebarCollapsed"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
      @click="sidebarCollapsed = true"
    ></div>

    <!-- Sidebar -->
    <Sidebar
      :collapsed="sidebarCollapsed"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
    />

    <!-- Main Content -->
    <div class="flex flex-col flex-1">
      <NavBar @toggleSidebar="sidebarCollapsed = !sidebarCollapsed" />
      <main class="flex-1 p-4 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "../components/Sidebar/SideBar.vue";
import NavBar from "../components/Nav/NavBar.vue";

const sidebarCollapsed = ref(true); // default: yopiq
</script>
