<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from './layouts/AppLayout.vue'

const token = sessionStorage.getItem('teacherToken') // bu string
const route = useRoute()
const router = useRouter()

const layout = computed(() => route.meta.layout || AppLayout)

onMounted(() => {
  if (!token && route.path !== '/login') {
    router.push('/login')
  }
})
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<style scoped>
</style>
