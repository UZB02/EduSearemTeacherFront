<template>
  <Card
    class="group-card border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl hover:-translate-y-1 bg-white"
  >
    <!-- Header -->
    <template #header>
      <div class="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-5 rounded-t-xl text-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-white/20 p-3 rounded-full shadow-md">
              <i class="pi pi-graduation-cap text-2xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold tracking-wide">{{ group.name }}</h2>
              <p class="text-green-100 text-sm">Guruh</p>
            </div>
          </div>
          <Badge
            :value="group.students.length"
            severity="success"
            class="bg-white text-green-600 font-semibold px-3 py-1 rounded-full shadow-sm"
          />
        </div>
      </div>
    </template>

    <!-- Content -->
    <template #content>
      <div class="p-4">
        <!-- Student count -->
        <div class="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg">
          <i class="pi pi-users text-green-600"></i>
          <span class="font-medium text-green-700">{{ group.students.length }} ta o'quvchi</span>
        </div>

        <!-- Student list -->
        <div v-if="group.students.length > 0" class="space-y-3">
          <h4 class="font-semibold text-gray-800 flex items-center gap-2">
            <i class="pi pi-list text-sm text-green-600"></i> O'quvchilar ro'yxati:
          </h4>
          <div class="max-h-48 overflow-y-auto space-y-2 pr-1">
            <div
              v-for="student in group.students"
              :key="student._id"
              class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-green-50 transition-colors shadow-sm"
            >
              <div class="bg-green-100 p-2 rounded-full">
                <i class="pi pi-user text-green-600 text-sm"></i>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-800">{{ student.name }} {{ student.lastname }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-8">
          <i class="pi pi-user-minus text-4xl text-gray-400 mb-3"></i>
          <p class="text-gray-500 italic">Bu guruhda o'quvchi yo'q</p>
        </div>
      </div>
    </template>

    <!-- Footer -->
    <template #footer>
      <div class="px-6 pb-6">
        <Button
          label="Batafsil ko'rish"
          icon="pi pi-arrow-right"
          class="w-full font-semibold"
          severity="success"
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
