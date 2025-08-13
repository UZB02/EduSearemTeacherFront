<template>
  <Card class="shadow-lg">
    <template #header>
      <div class="flex items-center gap-2 p-4 pb-0">
        <i class="pi pi-calendar text-xl text-blue-600"></i>
        <h3 class="text-xl font-semibold text-gray-800">Sana Tanlash</h3>
      </div>
    </template>

    <template #content>
      <div class="flex flex-col gap-4 p-4">
        <label class="font-medium text-gray-700 whitespace-nowrap">Davomat sanasi:</label>
        <Calendar 
          v-model="value" 
          dateFormat="dd/mm/yy"
          :maxDate="new Date()"
          showIcon
          iconDisplay="input"
          class="w-full max-w-xs"
          placeholder="Sanani tanlang"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from 'primevue/card'
import Calendar from 'primevue/calendar'

const props = defineProps({
  modelValue: Date
})
const emit = defineEmits(['update:modelValue'])

// v-model bilan ishlashi uchun computed getter va setter
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
