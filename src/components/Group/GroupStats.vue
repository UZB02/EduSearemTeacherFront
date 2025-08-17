<template>
  <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card class="text-center bg-gradient-to-br from-green-50 to-emerald-100 border-0">
      <template #content>
        <div class="p-6">
          <i class="pi pi-chart-line text-4xl text-green-600 mb-4"></i>
          <h3 class="text-2xl font-bold text-green-800">{{ groups.length }}</h3>
          <p class="text-green-600 font-medium">Jami Guruhlar</p>
        </div>
      </template>
    </Card>

    <Card class="text-center bg-gradient-to-br from-gray-50 to-cyan-100 border-0">
      <template #content>
        <div class="p-6">
          <i class="pi pi-users text-4xl text-gray-600 mb-4"></i>
          <h3 class="text-2xl font-bold text-gray-800">{{ totalStudents }}</h3>
          <p class="text-gray-600 font-medium">Jami O'quvchilar</p>
        </div>
      </template>
    </Card>

    <Card class="text-center bg-gradient-to-br from-purple-50 to-violet-100 border-0">
      <template #content>
        <div class="p-6">
          <i class="pi pi-calculator text-4xl text-purple-600 mb-4"></i>
          <h3 class="text-2xl font-bold text-purple-800">{{ averageStudents }}</h3>
          <p class="text-purple-600 font-medium">O'rtacha Guruh Hajmi</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card';
import { computed } from 'vue';

// ✅ Propni aniqlash
const props = defineProps({
  groups: {
    type: Array,
    required: true
  }
});

// ✅ Computedlar props.groups orqali ishlaydi
const totalStudents = computed(() =>
  props.groups.reduce((total, group) => total + group.students.length, 0)
);

const averageStudents = computed(() =>
  props.groups.length === 0 ? 0 : Math.round(totalStudents.value / props.groups.length)
);
</script>

