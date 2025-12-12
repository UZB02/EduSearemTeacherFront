<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Savolni tahrirlash</h1>

    <div class="grid gap-4">
      <!-- Savol matni -->
      <div>
        <label class="block mb-1">Savol matni</label>
        <Editor v-model="question.question" placeholder="Savol matni" class="w-full" />
      </div>

      <!-- Javob variantlari -->
      <div>
        <label class="block mb-1">Variantlar</label>
        <div v-for="(opt, i) in question.options" :key="i" class="flex gap-2 mb-2 items-center">
          <Editor v-model="question.options[i]" placeholder="Javob varianti" class="flex-1" />
          <Button
            icon="pi pi-trash"
            class="p-button-sm p-button-danger"
            @click="removeOption(i)"
          />
        </div>
        <Button label="Variant qo‘shish" icon="pi pi-plus" class="p-button-sm mt-1" @click="addOption" />
      </div>

      <!-- To‘g‘ri javob -->
      <div>
        <label class="block mb-1">To‘g‘ri javob</label>
      <Dropdown
  v-model="question.correctAnswer"
  :options="question.options"
  :optionLabel="htmlLabel"
  placeholder="To‘g‘ri javobni tanlang"
  class="w-full"
>
  <template #value="slotProps">
    <div v-html="slotProps.value"></div>
  </template>

  <template #option="slotProps">
    <div v-html="slotProps.option"></div>
  </template>
</Dropdown>

      </div>

      <!-- Ball -->
      <div>
        <label class="block mb-1">Ball</label>
        <InputNumber v-model="question.points" :min="1" class="w-24" />
      </div>
    </div>

    <!-- Tugmalar -->
    <div class="mt-4 flex gap-2">
      <Button label="Bekor qilish" icon="pi pi-times" class="p-button-text" @click="cancel" />
      <Button label="Saqlash" icon="pi pi-check" class="p-button-success" @click="saveQuestion" :disabled="loading" />
    </div>

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
import Editor from "primevue/editor";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const question = ref({
  question: "",
  options: [],
  correctAnswer: "",
  points: 1,
});

const loading = ref(false);
const testId = route.params.id;
const index = parseInt(route.params.index);

// Savol ma'lumotlarini yuklash
const loadQuestion = async () => {
  try {
    const res = await api.get(`/tests/${testId}`);
    const q = res.data.questions[index];
    if (!q) throw new Error("Savol topilmadi");
    question.value = JSON.parse(JSON.stringify(q)); // Deep copy
  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: err.message });
  }
};

// Variant qo‘shish
const addOption = () => {
  question.value.options.push("");
};

// Variantni o‘chirish
const removeOption = (i) => {
  question.value.options.splice(i, 1);
  if (question.value.correctAnswer === question.value.options[i]) {
    question.value.correctAnswer = "";
  }
};

// Savolni saqlash
const saveQuestion = async () => {
  if (!question.value.question || question.value.options.length === 0 || !question.value.correctAnswer) {
    toast.add({ severity: "warn", summary: "Ogohlantirish", detail: "Barcha maydonlar to‘ldirilishi kerak" });
    return;
  }

  loading.value = true;
  try {
    await api.put(`/tests/${testId}/questions/${question.value._id}`, question.value);
    toast.add({ severity: "success", summary: "Muvaffaqiyat", detail: "Savol yangilandi" });
    router.push(`/tests/${testId}`);
  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: err.response?.data?.message || err.message });
  } finally {
    loading.value = false;
  }
};
function htmlLabel(option) {
  return option;
}
// Bekor qilish
const cancel = () => router.push(`/tests/${testId}`);

onMounted(loadQuestion);
</script>
