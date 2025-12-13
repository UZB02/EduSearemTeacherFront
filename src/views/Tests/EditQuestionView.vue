<template>
  <div class="p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
    <!-- Sarlavha -->
    <h1
      class="text-xl sm:text-2xl font-bold
             mb-4 sm:mb-6"
    >
      Savolni tahrirlash
    </h1>

    <!-- Forma -->
    <div
      class="grid gap-4 sm:gap-5"
    >
      <!-- Savol matni -->
      <div>
        <label class="block mb-1 text-sm sm:text-base font-medium">
          Savol matni
        </label>
        <Editor
          v-model="question.question"
          placeholder="Savol matni"
          class="w-full"
        />
      </div>

      <!-- Variantlar -->
      <div>
        <label class="block mb-2 text-sm sm:text-base font-medium">
          Variantlar
        </label>

        <div
          v-for="(opt, i) in question.options"
          :key="i"
          class="flex flex-col sm:flex-row
                 gap-2 mb-2 items-stretch sm:items-center"
        >
          <Editor
            v-model="question.options[i]"
            placeholder="Javob varianti"
            class="flex-1"
          />

          <Button
            icon="pi pi-trash"
            class="p-button-sm p-button-danger
                   w-full sm:w-auto"
            @click="removeOption(i)"
          />
        </div>

        <Button
          label="Variant qo‘shish"
          icon="pi pi-plus"
          class="p-button-sm mt-2 w-full sm:w-auto"
          @click="addOption"
        />
      </div>

      <!-- To‘g‘ri javob -->
      <div>
        <label class="block mb-1 text-sm sm:text-base font-medium">
          To‘g‘ri javob
        </label>

        <Dropdown
          v-model="question.correctAnswer"
          :options="question.options"
          placeholder="To‘g‘ri javobni tanlang"
          class="w-full"
        >
          <template #value="slotProps">
            <div v-html="slotProps.value" />
          </template>

          <template #option="slotProps">
            <div v-html="slotProps.option" />
          </template>
        </Dropdown>
      </div>

      <!-- Ball -->
      <div>
        <label class="block mb-1 text-sm sm:text-base font-medium">
          Ball
        </label>

        <InputNumber
          v-model="question.points"
          :min="1"
          class="w-full sm:w-32"
        />
      </div>
    </div>

    <!-- Tugmalar -->
    <div
      class="mt-6 flex flex-col sm:flex-row
             gap-3 sm:gap-2"
    >
      <Button
        label="Bekor qilish"
        icon="pi pi-times"
        class="p-button-text
               w-full sm:w-auto"
        @click="cancel"
      />

      <Button
        label="Saqlash"
        icon="pi pi-check"
        class="p-button-success
               w-full sm:w-auto"
        @click="saveQuestion"
        :disabled="loading"
      />
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

// Savolni yuklash
const loadQuestion = async () => {
  try {
    const res = await api.get(`/tests/${testId}`);
    const q = res.data.questions[index];
    if (!q) throw new Error("Savol topilmadi");
    question.value = JSON.parse(JSON.stringify(q));
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Xato",
      detail: err.message,
    });
  }
};

// Variant qo‘shish
const addOption = () => {
  question.value.options.push("");
};

// Variantni o‘chirish
const removeOption = (i) => {
  const removed = question.value.options[i];
  question.value.options.splice(i, 1);
  if (question.value.correctAnswer === removed) {
    question.value.correctAnswer = "";
  }
};

// Saqlash
const saveQuestion = async () => {
  if (
    !question.value.question ||
    question.value.options.length === 0 ||
    !question.value.correctAnswer
  ) {
    toast.add({
      severity: "warn",
      summary: "Ogohlantirish",
      detail: "Barcha maydonlar to‘ldirilishi kerak",
    });
    return;
  }

  loading.value = true;
  try {
    await api.put(
      `/tests/${testId}/questions/${question.value._id}`,
      question.value
    );
    toast.add({
      severity: "success",
      summary: "Muvaffaqiyat",
      detail: "Savol yangilandi",
    });
    router.push(`/tests/${testId}`);
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Xato",
      detail: err.response?.data?.message || err.message,
    });
  } finally {
    loading.value = false;
  }
};

// Bekor qilish
const cancel = () => router.push(`/tests/${testId}`);

onMounted(loadQuestion);
</script>
