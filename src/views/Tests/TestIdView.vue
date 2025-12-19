<template>
  <div class="p-3 sm:p-4 md:p-6 max-w-5xl mx-auto">

    <!-- Test nomi va amallar -->
    <div
      class="flex flex-col md:flex-row
             md:justify-between md:items-start
             gap-4 mb-6"
    >
      <!-- Test info -->
      <div class="flex-1">
        <h1
          class="text-xl sm:text-2xl md:text-3xl
                 font-bold mb-2"
        >
          {{ test.title }}
        </h1>

        <p class="mb-2 text-gray-600 text-sm sm:text-base">
          {{ test.description }}
        </p>

        <p class="text-sm text-blue-600">
          Fan: {{ test.subjectId?.name || '-' }}
        </p>
      </div>

      <!-- Tugmalar -->
      <div class="w-full md:w-auto">
        <TestActions
          :test-id="test._id"
          :link="link"
          class="w-full md:w-auto"
          @link-generated="link = $event"
          @add-question="goToAddQuestion"
          @view-results="goToResults"
        />
      </div>
    </div>

    <!-- Savollar -->
    <div
      v-for="(q, index) in test.questions"
      :key="q._id"
      class="mb-4"
    >
      <TestQuestion
        :question="q"
        :index="index"
        v-model="answers[index]"
        :submitted="submitted"
        @edit-question="editQuestion"
        @delete-question="deleteQuestion"
      />
    </div>

    <!-- Submit -->
    <div
      class="flex flex-col sm:flex-row
             gap-3 mt-6"
    >
      <Button
        label="Javoblarni yuborish"
        icon="pi pi-check"
        class="p-button-success w-full sm:w-auto"
        @click="submitAnswers"
        :disabled="submitted"
      />
    </div>

    <!-- Natija -->
    <TestResultDialog
      v-model:visible="resultDialog"
      :score="score"
    />

    <Toast />
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/utils/api.js";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

import TestQuestion from "../../components/Tests/TetsId/TestQuestion.vue";
import TestResultDialog from "../../components/Tests/TetsId/TestResultDialog.vue";
import TestActions from "../../components/Tests/TetsId/TestActions.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const test = ref({
  title: "",
  description: "",
  subjectId: null,
  questions: [],
  teacherId: "",
  linkToken: null,
});

const answers = ref([]);
const submitted = ref(false);
const score = ref(0);
const resultDialog = ref(false);
const link = ref("");

// Testni yuklash
const loadTest = async () => {
  try {
    const res = await api.get(`/tests/${route.params.id}`);
    test.value = res.data;
    answers.value = Array(test.value.questions.length).fill("");
    if (res.data.linkToken) {
      link.value = `${window.location.origin}/test/${res.data.linkToken}`;
    }
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Xato",
      detail: err.response?.data?.message || err.message,life: 3000
    });
  }
};

// Javoblarni yuborish
const submitAnswers = () => {
  let tempScore = 0;
  test.value.questions.forEach((q, i) => {
    if (answers.value[i] === q.correctAnswer) {
      tempScore += q.points || 1;
    }
  });
  score.value = tempScore;
  submitted.value = true;
  resultDialog.value = true;
};

// Yo'naltirishlar
const goToAddQuestion = () =>
  router.push(`/tests/${test.value._id}/add`);

const goToResults = () =>
  router.push(`/tests/${test.value._id}/results`);

const editQuestion = (index) =>
  router.push(`/tests/${test.value._id}/edit-question/${index}`);

// Savolni o'chirish
const deleteQuestion = async (index) => {
  try {
    await api.delete(
      `/tests/${test.value._id}/questions/${test.value.questions[index]._id}`
    );
    test.value.questions.splice(index, 1);
    answers.value.splice(index, 1);
    toast.add({
      severity: "success",
      summary: "Muvaffaqiyat",
      detail: "Savol o‘chirildi",life: 3000
    });
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Xato",
      detail: err.response?.data?.message || err.message,life: 3000
    });
  }
};

onMounted(loadTest);
</script>
