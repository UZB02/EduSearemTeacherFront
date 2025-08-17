<template>
  <Card class="group-card hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1">
    <template #header>
      <div class="bg-gradient-to-r from-gray-500 to-gray-600 p-4 rounded text-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-white/20 p-3 rounded-full">
              <i class="pi pi-graduation-cap text-2xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ group.name }}</h2>
              <p class="text-gray-100 text-sm">Guruh</p>
            </div>
          </div>
          <Badge :value="group.students.length" severity="info" class="bg-white text-gray-600 font-semibold px-3 py-1" />
        </div>
      </div>
    </template>

    <template #content>
      <div>
        <div class="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
          <i class="pi pi-users text-gray-600"></i>
          <span class="font-medium text-gray-700">{{ group.students.length }} ta o'quvchi</span>
        </div>

        <div v-if="group.students.length > 0" class="space-y-3">
          <h4 class="font-semibold text-gray-800 flex items-center gap-2">
            <i class="pi pi-list text-sm"></i> O'quvchilar ro'yxati:
          </h4>
          <div class="max-h-48 overflow-y-auto space-y-2">
            <div
              v-for="student in group.students"
              :key="student._id"
              class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="bg-gray-100 p-2 rounded-full">
                <i class="pi pi-user text-gray-600 text-sm"></i>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-800">{{ student.name }} {{ student.lastname }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <i class="pi pi-user-minus text-4xl text-gray-400 mb-3"></i>
          <p class="text-gray-500 italic">Bu guruhda o'quvchi yo'q</p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="px-6 pb-6">
        <Button
          label="Batafsil ko'rish"
          icon="pi pi-arrow-right"
          class="w-full"
          severity="secondary"
          outlined
          @click="router.push(`/${group._id}`)"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import Badge from 'primevue/badge';
import Button from 'primevue/button';

defineProps({ group: Object });
const router = useRouter();
</script>
