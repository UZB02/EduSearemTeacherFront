<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Button from "primevue/button";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const props = defineProps({ collapsed: { type: Boolean, default: true } });
const emit = defineEmits(["toggle"]);

// Menu items
const menuItems = [
  { label: "Dashboard", icon: "pi pi-home", to:'/' },
  { label: "Fanlar", icon: "pi pi-book", to:'/subjects' },
  { label: "Savollar", icon: "pi pi-file-pdf", to:'/tests' },
];

// Reactive desktop flag
const isDesktop = ref(window.innerWidth >= 768);

const updateWidth = () => {
  isDesktop.value = window.innerWidth >= 768;
};

onMounted(() => {
  window.addEventListener("resize", updateWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});

// Navigate function
function navigate(path) {
  if (path) {
    router.push(path);
    // Mobil holatda sidebarni yopish
    if (!isDesktop.value) emit("toggle");
  }
}
</script>

<template>
  <aside
    :class="[
      'bg-white border-r border-gray-300 transition-transform duration-300 ease-in-out h-full z-50 flex flex-col fixed md:static top-0 left-0',
      collapsed ? '-translate-x-full md:translate-x-0 md:w-16' : 'translate-x-0 w-64'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between p-4 border-b border-gray-300">
      <span class="font-bold text-blue-600 text-lg" v-if="!collapsed">MyApp</span>
      <Button
        :icon="collapsed ? 'pi pi-arrow-right' : 'pi pi-arrow-left'"
        class="p-button-rounded p-button-text hidden md:inline-flex"
        @click="$emit('toggle')"
      />
    </div>

    <!-- Menu -->
    <ul class="flex-1 flex flex-col mt-4 space-y-2 px-2">
      <li v-for="item in menuItems" :key="item.label">
        <Button
          :label="!collapsed ? item.label : ''"
          :icon="item.icon"
          :class="[
            'w-full justify-start',
            route.path === item.to
              ? 'bg-blue-100 text-blue-600 font-semibold'
              : 'hover:bg-blue-50'
          ]"
          v-tooltip="isDesktop ? item.label : null"
          @click="navigate(item.to)"
        />
      </li>
    </ul>

    <!-- Mobile close button -->
    <div class="p-2 border-t md:hidden" v-if="!collapsed">
      <Button icon="pi pi-times" class="w-full" @click="$emit('toggle')" />
    </div>
  </aside>
</template>
