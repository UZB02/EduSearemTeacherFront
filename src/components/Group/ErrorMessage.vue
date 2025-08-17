<template>
  <Message severity="error" class="mb-6">
    <div class="flex items-center gap-2">
      <i class="pi pi-exclamation-triangle"></i>
      <span>{{ message }}</span>
    </div>
  </Message>
</template>

<script setup>
import Message from 'primevue/message';
defineProps({ message: String });
</script>
