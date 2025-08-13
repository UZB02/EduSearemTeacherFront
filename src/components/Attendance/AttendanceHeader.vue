<template>
  <Card class="mb-6 shadow-lg">
    <template #content>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <i class="pi pi-users text-3xl text-blue-600"></i>
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-1">Guruhdagi O'quvchilar Davomati</h1>
            <p class="text-gray-600">{{ group?.name || '' }}</p>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-500">Bugungi sana</div>
          <div class="text-md font-semibold text-gray-800">{{ formatDate(new Date()) }}</div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card';

defineProps({
  group: Object
});

const formatDate = (d) => {
  return new Date(d).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>
