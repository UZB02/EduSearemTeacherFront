<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <GroupCard v-for="group in groups" :key="group._id" :group="group" />
  </div>
</template>

<script setup>
import GroupCard from './GroupCard.vue';
defineProps({ groups: Array });
</script>
