<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">
      Testga yangi savol qo‘shish
    </h1>
    <p class="mb-4 text-gray-600">Test: {{ test.title || '-' }}</p>

    <div class="flex flex-col gap-4 border p-4 rounded shadow-sm bg-white">

      <!-- Savol matni -->
      <div class="flex flex-col">
        <label class="mb-1 font-semibold">Savol matni</label>
        <Editor v-model="newQuestion.question" placeholder="Savol matni" class="w-full mb-2" />
      </div>

      <!-- Variantlar -->
      <div class="flex flex-col gap-2">
        <label class="mb-1 font-semibold">Variantlar</label>
        <div v-for="(opt, i) in newQuestion.options" :key="i" class="flex gap-2 items-center">
          <InputText v-model="newQuestion.options[i]" placeholder="Javob varianti" class="flex-1" />
          <Button icon="pi pi-trash" class="p-button-sm p-button-danger" @click="removeOption(i)" />
        </div>
        <Button label="Variant qo‘shish" icon="pi pi-plus" class="p-button-sm mt-1" @click="addOption" />
      </div>

      <!-- To'g'ri javob -->
      <div class="flex flex-col mt-2">
        <label class="mb-1 font-semibold">To‘g‘ri javob</label>
        <Dropdown
          v-model="newQuestion.correctAnswer"
          :options="newQuestion.options"
          placeholder="To‘g‘ri javobni tanlang"
          class="w-full"
        />
      </div>

      <!-- Ball -->
      <div class="flex flex-col mt-2 w-32">
        <label class="mb-1 font-semibold">Ball</label>
        <InputText type="number" v-model.number="newQuestion.points" placeholder="Ball" class="w-full" />
      </div>

      <!-- Tugmalar -->
      <div class="flex gap-2 mt-4">
        <Button
          label="Savol qo‘shish"
          icon="pi pi-plus"
          class="p-button-primary"
          @click="addQuestion"
          :disabled="loading"
        />
        <Button
          label="Orqaga"
          icon="pi pi-arrow-left"
          class="p-button-secondary"
          @click="goBack"
        />
      </div>

    </div>

    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Editor from "primevue/editor";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import api from "@/utils/api.js";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const test = ref({});
const loading = ref(false);

const newQuestion = ref({
  question: "",
  options: [],      // variantlar arrayi
  correctAnswer: "",
  points: 1,
});

// Test ma'lumotlarini yuklash
const loadTest = async () => {
  try {
    const res = await api.get(`/tests/${route.params.id}`);
    test.value = res.data;
  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: err.response?.data?.message || err.message,life: 3000 });
  }
};

// Variant qo‘shish
const addOption = () => {
  newQuestion.value.options.push("");
};

// Variantni o‘chirish
const removeOption = (index) => {
  newQuestion.value.options.splice(index, 1);
  // Agar to'g'ri javob o'chirilgan variant bo'lsa, reset qilamiz
  if (!newQuestion.value.options.includes(newQuestion.value.correctAnswer)) {
    newQuestion.value.correctAnswer = "";
  }
};

// Savol qo‘shish
const addQuestion = async () => {
  if (!newQuestion.value.question || newQuestion.value.options.length === 0 || !newQuestion.value.correctAnswer) {
    toast.add({ severity: "warn", summary: "Ogohlantirish", detail: "Barcha maydonlar to‘ldirilishi kerak",life: 3000 });
    return;
  }

  loading.value = true;

  try {
    await api.post(`/tests/${route.params.id}/questions`, {
      question: newQuestion.value.question,
      options: newQuestion.value.options,
      correctAnswer: newQuestion.value.correctAnswer,
      points: newQuestion.value.points,
    });

    toast.add({ severity: "success", summary: "Muvaffaqiyat", detail: "Savol qo‘shildi",life: 3000 });
        router.push(`/tests/${route.params.id}`);
    // Formani tozalash
    newQuestion.value.question = "";
    newQuestion.value.options = [];
    newQuestion.value.correctAnswer = "";
    newQuestion.value.points = 1;

  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: err.response?.data?.message || err.message,life: 3000 });
  } finally {
    loading.value = false;
  }
};

// Orqaga
const goBack = () => {
  router.push(`/tests/${route.params.id}`);
};

onMounted(loadTest);
</script>
