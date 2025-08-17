<template>
  <Card class="text-center py-16">
    <template #content>
      <div class="flex flex-col items-center gap-4">
        <i class="pi pi-inbox text-6xl text-gray-400"></i>
        <h3 class="text-2xl font-semibold text-gray-700">Guruhlar topilmadi</h3>
        <p class="text-gray-500 max-w-md">
          Sizga hali biriktirilgan guruhlar yo'q. Administrator bilan bog'laning.
        </p>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card';
</script>
