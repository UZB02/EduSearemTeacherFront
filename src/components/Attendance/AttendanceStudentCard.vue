<template>
  <div class="p-4 shadow-lg bg-white rounded-lg">
    <div class="flex items-center gap-3 mb-2">
      <Avatar 
        :label="student.name.charAt(0) + student.lastname.charAt(0)"
        class="bg-blue-100 text-blue-800"
        size="normal"
      />
      <div class="flex-1">
        <div class="font-semibold text-gray-800 text-lg">
          {{ student.name }} {{ student.lastname }}
        </div>
        <div class="text-sm text-gray-500">ID: {{ student._id.slice(-6) }}</div>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-4 text-center">
      <label class="flex flex-col items-center cursor-pointer" v-for="option in statusOptions" :key="option.value">
        <RadioButton 
          v-model="modelValue[student._id]" 
          :inputId="option.value + '-' + student._id" 
          :value="option.value" 
          class="mb-1"
          :aria-label="option.label + ' ' + student.name" 
        />
        <i :class="[option.icon, option.color, 'text-2xl']"></i>
        <span :class="option.color">{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import Avatar from 'primevue/avatar';
import RadioButton from 'primevue/radiobutton';

defineProps({
  student: Object,
  modelValue: Object
});

defineEmits(['update:modelValue']);

const statusOptions = [
  { value: 'present', label: 'Bor', icon: 'pi pi-check-circle', color: 'text-green-600' },
  { value: 'absent', label: "Yo'q", icon: 'pi pi-times-circle', color: 'text-red-600' },
  { value: 'late', label: 'Kechikdi', icon: 'pi pi-clock', color: 'text-yellow-500' }
];
</script>
