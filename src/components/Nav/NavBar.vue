<template>
  <header class="flex items-center justify-between bg-white border-b border-gray-300 px-4 py-2">
    <!-- Sidebar Toggle (faqat mobil) -->
    <Button
      icon="pi pi-bars"
      class="md:hidden"
      @click="$emit('toggleSidebar')"
    />

    <h1 class="text-lg font-semibold text-gray-700">Dashboard</h1>

    <div class="flex items-center space-x-2">
      <Button icon="pi pi-bell" class="p-button-rounded p-button-text" />

      <Button
        icon="pi pi-user"
        @click="toggleMenu"
        class="p-button-rounded p-button-text"
      />

      <Menu ref="menu" :model="menuItems" :popup="true" />
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"; // Router import qilindi
import Button from "primevue/button";
import Menu from "primevue/menu";

const router = useRouter(); // Router instance

const menu = ref(null);

// Teacher ma'lumotini sessionStorage dan olish
let teacherData = sessionStorage.getItem('teacherData');
let teacher = teacherData ? JSON.parse(teacherData) : { name: '', lastname: '' };

// Logout funksiyasi
const handleLogout = () => {
  sessionStorage.removeItem('teacherData');
  sessionStorage.removeItem('teacherToken');
  router.push('/login'); // login sahifasiga yo'naltirish
};

// Menu items
const menuItems = [
  {
    label: 'Options',
    items: [
      { label: `${teacher.name} ${teacher.lastname}`, icon: 'pi pi-user' },
      { 
        label: 'Chiqish', 
        icon: 'pi pi-sign-out',
        styleClass: 'text-red-500 hover:text-red-700',
        command: handleLogout // bosilganda ishlaydi
      }
    ]
  }
];
// Toggle menu
const toggleMenu = (event) => {
  menu.value.toggle(event);
};
</script>