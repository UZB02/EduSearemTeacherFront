<template>
  <div class="">
    <div class="container">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <i class="pi pi-users text-3xl text-blue-600"></i>
          <h1 class="text-4xl font-bold text-gray-800">Mening Guruhlarim</h1>
        </div>
        <p class="text-gray-600 text-lg">O'quvchilar va guruhlar boshqaruvi</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
        <p class="text-gray-600 mt-4 text-lg">Ma'lumotlar yuklanmoqda...</p>
      </div>

      <!-- Error State -->
      <Message v-if="error" severity="error" class="mb-6">
        <div class="flex items-center gap-2">
          <i class="pi pi-exclamation-triangle"></i>
          <span>{{ error }}</span>
        </div>
      </Message>

      <!-- Empty State -->
      <Card v-if="groups.length === 0 && !loading && !error" class="text-center py-16">
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

      <!-- Groups Grid -->
      <div v-if="groups.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          v-for="group in groups"
          :key="group._id"
          class="group-card hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1"
        >
          <template #header>
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded text-white">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="bg-white/20 p-3 rounded-full">
                    <i class="pi pi-graduation-cap text-2xl"></i>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold">{{ group.name }}</h2>
                    <p class="text-blue-100 text-sm">Guruh</p>
                  </div>
                </div>
                <Badge 
                  :value="group.students.length" 
                  severity="info" 
                  class="bg-white text-blue-600 font-semibold px-3 py-1"
                />
              </div>
            </div>
          </template>

          <template #content>
            <div class="">
              <!-- Students Count Summary -->
              <div class="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <i class="pi pi-users text-blue-600"></i>
                <span class="font-medium text-gray-700">
                  {{ group.students.length }} ta o'quvchi
                </span>
              </div>

              <!-- Students List -->
              <div v-if="group.students.length > 0" class="space-y-3">
                <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                  <i class="pi pi-list text-sm"></i>
                  O'quvchilar ro'yxati:
                </h4>
                <div class="max-h-48 overflow-y-auto space-y-2">
                  <div
                    v-for="student in group.students"
                    :key="student._id"
                    class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div class="bg-blue-100 p-2 rounded-full">
                      <i class="pi pi-user text-blue-600 text-sm"></i>
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-gray-800">
                        {{ student.name }} {{ student.lastname }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty Students State -->
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
      </div>

      <!-- Statistics Summary -->
      <div v-if="groups.length > 0" class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card class="text-center bg-gradient-to-br from-green-50 to-emerald-100 border-0">
          <template #content>
            <div class="p-6">
              <i class="pi pi-chart-line text-4xl text-green-600 mb-4"></i>
              <h3 class="text-2xl font-bold text-green-800">{{ groups.length }}</h3>
              <p class="text-green-600 font-medium">Jami Guruhlar</p>
            </div>
          </template>
        </Card>

        <Card class="text-center bg-gradient-to-br from-blue-50 to-cyan-100 border-0">
          <template #content>
            <div class="p-6">
              <i class="pi pi-users text-4xl text-blue-600 mb-4"></i>
              <h3 class="text-2xl font-bold text-blue-800">{{ totalStudents }}</h3>
              <p class="text-blue-600 font-medium">Jami O'quvchilar</p>
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Card from "primevue/card";
import Badge from "primevue/badge";
import Button from "primevue/button";
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";
import { useRoute, useRouter } from 'vue-router'

const groups = ref([]);
const loading = ref(false);
const error = ref("");

const router = useRouter()

// Computed properties for statistics
const totalStudents = computed(() => {
  return groups.value.reduce((total, group) => total + group.students.length, 0);
});

const averageStudents = computed(() => {
  if (groups.value.length === 0) return 0;
  return Math.round(totalStudents.value / groups.value.length);
});

const fetchGroups = async () => {
  loading.value = true;
  error.value = "";
  try {
    const token = sessionStorage.getItem("teacherToken");

    const res = await axios.get("/attendance/my-students", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    groups.value = res.data;
  } catch (e) {
    error.value = e.response?.data?.message || "Ma'lumotlarni olishda xatolik yuz berdi";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchGroups();
});
</script>

<style scoped>
.group-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.group-card:hover {
  transform: translateY(-4px);
}

/* Custom scrollbar for student list */
.max-h-48::-webkit-scrollbar {
  width: 4px;
}

.max-h-48::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.max-h-48::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.max-h-48::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>