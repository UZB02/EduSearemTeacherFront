<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Test natijalari: {{ testTitle }}</h1>

    <div v-if="loading" class="text-center text-lg">Natijalar yuklanmoqda...</div>

    <div v-else-if="results?.length === 0" class="text-center text-gray-500">
      Natijalar topilmadi.
    </div>

    <div v-else>
      <DataTable :value="results" class="mb-4" responsiveLayout="scroll">
        <Column field="studentName" header="Ism" sortable></Column>
        <Column field="studentSurname" header="Familiya" sortable></Column>
        <Column field="score" header="Ball" sortable></Column>
        <Column header="Javoblar">
          <template #body="slotProps">
            <Button
              icon="pi pi-eye"
              class="p-button-sm p-button-info"
              @click="viewAnswers(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Dialog: o'quvchi javoblari -->
<Dialog v-model:visible="showAnswersDialog" modal header="O'quvchi javoblari" :style="{ width: '600px' }">
  <div v-if="selectedStudent">
    <h3 class="font-semibold mb-4">{{ selectedStudent.studentName }} {{ selectedStudent.studentSurname }}</h3>

    <div v-for="(a, idx) in selectedStudent.answers" :key="idx" class="mb-4 p-3 border rounded">
      <p class="mb-1">
        <strong>Savol {{ idx + 1 }}:</strong>
        <span v-html="a.questionText"></span>
      </p>
      <p class="mb-1">
        <strong>Tanlangan javob:</strong>
        <span v-html="a.selectedOption || '<em>Hech narsa tanlanmagan</em>'"></span>
      </p>
      <p class="mb-1">
        <strong>To'g'ri javob:</strong>
        <span v-html="a.correctAnswer"></span>
      </p>
    </div>
  </div>
</Dialog>


    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "@/utils/api.js";
import { useToast } from "primevue/usetoast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";

const route = useRoute();
const toast = useToast();

const testId = route.params.id;
const testTitle = ref("");
const results = ref([]);
const loading = ref(true);

const showAnswersDialog = ref(false);
const selectedStudent = ref(null);

const loadResults = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/tests/${testId}/results`);
    console.log(res); // ko'rib chiqish
    testTitle.value = "Test natijalari"; // Agar API testTitle bermasa, shunchaki nom qo'yish
    results.value = res.data; // Agar res.data allaqachon array bo'lsa
  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: err.response?.data?.message || err.message });
  } finally {
    loading.value = false;
  }
};


// O'quvchi javoblarini ko'rsatish
const viewAnswers = (student) => {
  selectedStudent.value = student;
  showAnswersDialog.value = true;
};

onMounted(loadResults);
</script>
