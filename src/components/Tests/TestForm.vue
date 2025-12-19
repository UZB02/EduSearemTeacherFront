<template>
  <div class="bg-white rounded-lg shadow-lg p-4">
    <h1 class="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
      {{ test?._id ? 'Testni Tahrirlash' : 'Yangi Test' }}
    </h1>

    <div class="grid  gap-4">
      <!-- Asosiy ma'lumotlar -->
      <div class="">
        <h2 class="text-lg font-semibold mb-4 text-indigo-600">Asosiy ma'lumotlar</h2>

        <div class="grid md:grid-cols-3 gap-4">
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Test Nomi</label>
            <InputText v-model="form.title" class="w-full" />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Tavsif</label>
            <InputText v-model="form.description" class="w-full" />
          </div>
          <div class="">
          <label class="block mb-1 text-sm font-medium text-gray-700">Fan</label>
          <Dropdown v-model="form.subjectId" :options="subjects" optionLabel="name" optionValue="_id"
            placeholder="Fanni tanlang" class="w-full" />
        </div>
        </div>
      </div>

      <!-- SAVOL QO‘SHISH / TAHRIRLASH FORMASI -->
      <div class="">
        <h2 class="text-lg font-semibold mb-4 text-indigo-600">
          {{ isEditing ? "Savolni Tahrirlash" : "Savol qo‘shish" }}
        </h2>

        <div class="bg-white p-4 rounded-lg shadow mb-6">
          <Editor v-model="current.question" placeholder="Savol matni" class="w-full mb-3" />

          <label class="block mb-1 text-sm font-medium text-gray-700">Ball</label>
          <InputText v-model.number="current.points" type="number" class="w-full mb-3" min="1" />

          <div v-for="(opt, i) in current.options" :key="i" class="flex gap-2 items-center mb-2">
            <Editor v-model="current.options[i]" class="flex-1" placeholder="Javob varianti" />
            <Button icon="pi pi-trash" class="p-button-danger p-button-rounded p-button-sm"
              @click="removeCurrentOption(i)" />
          </div>

          <Button label="Variant qo‘shish" icon="pi pi-plus"
            class="p-button-info mb-3" @click="current.options.push('')" />

          <Dropdown v-model="current.correctAnswer" :options="current.options"
            placeholder="To‘g‘ri javobni tanlang" class="w-full" />

          <div class="flex gap-3 mt-4">
            <Button v-if="!isEditing" label="Savolni qo‘shish" icon="pi pi-check"
              class="p-button-success" @click="addQuestionCard" />

            <Button v-if="isEditing" label="Saqlash" icon="pi pi-save"
              class="p-button-warning" @click="saveEditedQuestion" />

            <Button v-if="isEditing" label="Bekor qilish" icon="pi pi-times"
              class="p-button-secondary" @click="cancelEditing" />
          </div>
        </div>

        <!-- PASTDAGI SAVOLLAR KARTALARI -->
        <h2 class="text-lg font-semibold mb-4 text-indigo-600">Savollar ro‘yxati</h2>

        <div v-if="form.questions.length === 0" class="text-gray-500">Hozircha savol yo‘q</div>

     <div v-for="(q, index) in form.questions" :key="index"
     class="border rounded-lg p-4 mb-3 bg-white shadow hover:shadow-md transition">

  <div class="flex justify-between items-center">
    <span class="font-semibold text-gray-700">Savol {{ index + 1 }}</span>

    <div class="flex gap-2">
      <Button icon="pi pi-pencil" class="p-button-info p-button-sm"
        @click="editQuestion(index)" />

      <Button icon="pi pi-trash" class="p-button-danger p-button-sm"
        @click="removeQuestion(index)" />
    </div>
  </div>

  <!-- Savol HTML bilan -->
  <p class="mt-2" v-html="q.question"></p>

  <p class="mt-2 text-sm">Ball: <b>{{ q.points }}</b></p>

  <!-- Javoblar HTML bilan -->
  <ul class="list-disc ml-5 mt-2">
    <li v-for="(o, i) in q.options" :key="i" v-html="o"></li>
  </ul>

  <!-- To‘g‘ri javob HTML bilan -->
  <p class="mt-2 text-sm flex gap-2">✔ To‘g‘ri javob: <b v-html="q.correctAnswer"></b></p>
</div>

      </div>
    </div>

    <!-- Tugmalar -->
    <div class="mt-6 flex gap-4 justify-end">
<Button
  label="Bekor qilish"
  icon="pi pi-times"
  class="p-button-secondary"
  @click="handleCancel"
/>


      <Button label="Saqlash" icon="pi pi-check" class="p-button-success" @click="saveTest" />
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
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import Editor from "primevue/editor";
import api from "@/utils/api.js";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const test = ref(null);
const subjects = ref([]);

const form = ref({
  title: "",
  subjectId: null,
  description: "",
  questions: []
});

// --- SAVOL FORMA OBJECT ---
const current = ref({
  question: "",
  points: 1,
  options: [],
  correctAnswer: ""
});

const isEditing = ref(false);
const editingIndex = ref(null);

// --- LocalStorage kaliti ---
const lsKey = ref("questions_new");

// LocalStorage funksiyalari
const saveQuestionsToLS = () => {
  localStorage.setItem(lsKey.value, JSON.stringify(form.value.questions));
};

const loadQuestionsFromLS = () => {
  const saved = localStorage.getItem(lsKey.value);
  if (saved) {
    form.value.questions = JSON.parse(saved);
  }
};

// Fanlarni yuklash
const loadSubjects = async () => {
  try {
    const res = await api.get("/subjects");
    subjects.value = res.data;
  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: err.message, life: 3000 });
  }
};

// Current option o‘chirish
const removeCurrentOption = (i) => current.value.options.splice(i, 1);

// Formani tozalash
const resetCurrent = () => {
  current.value = {
    question: "",
    points: 1,
    options: [],
    correctAnswer: ""
  };
};

// Savol validatsiyasi
const validateQuestion = () => {
  if (!current.value.question) {
    toast.add({ severity: "warn", summary: "Xato", detail: "Savol matni bo‘sh bo‘lishi mumkin emas!", life: 3000 });
    return false;
  }
  if (current.value.options.length < 2) {
    toast.add({ severity: "warn", summary: "Xato", detail: "Kamida 2 ta javob varianti bo‘lishi kerak!", life: 3000 });
    return false;
  }
  if (!current.value.correctAnswer) {
    toast.add({ severity: "warn", summary: "Xato", detail: "To‘g‘ri javob tanlanmagan!", life: 3000 });
    return false;
  }
  return true;
};

// Tahrirlash rejimini bekor qilish
const cancelEditing = () => {
  resetCurrent();
  isEditing.value = false;
  editingIndex.value = null;
};

// Savol qo‘shish (kartaga tushadi)
const addQuestionCard = () => {
  if (!validateQuestion()) return;

  form.value.questions.push(JSON.parse(JSON.stringify(current.value)));
  saveQuestionsToLS();   // 🔥 localStorage saqlash

  resetCurrent();
  toast.add({ severity: "success", summary: "Qo‘shildi", detail: "Savol qo‘shildi" , life: 3000});
};

// Savolni kartadan tahrirlashga olish
const editQuestion = (index) => {
  editingIndex.value = index;
  isEditing.value = true;
  current.value = JSON.parse(JSON.stringify(form.value.questions[index]));
};

// Tahrirlangan savolni saqlash
const saveEditedQuestion = () => {
  if (!validateQuestion()) return;

  form.value.questions[editingIndex.value] = JSON.parse(JSON.stringify(current.value));
  saveQuestionsToLS(); // 🔥 localStorage saqlash

  toast.add({ severity: "success", summary: "Yangilandi", detail: "Savol tahrirlandi", life: 3000 });
  cancelEditing();
};

// Savolni o‘chirish
const removeQuestion = (i) => {
  form.value.questions.splice(i, 1);
  saveQuestionsToLS(); // 🔥 localStorage yangilash
};

// --- Page yuklanganda localStorage tiklash va serverdan testni olish ---
onMounted(async () => {
  await loadSubjects();

  if (route.params.id) {
    lsKey.value = "questions_" + route.params.id;

    try {
      const res = await api.get(`/tests/${route.params.id}`);
      test.value = res.data;

      form.value = {
        title: test.value.title,
        subjectId: test.value.subjectId?._id,
        description: test.value.description,
        questions: test.value.questions
      };

      // LocalStorage’da saqlangan bo‘lsa ustiga yuklaymiz
      loadQuestionsFromLS();
    } catch (err) {
      toast.add({ severity: "error", summary: "Xato", detail: err.message, life: 3000 });
    }
  } else {
    // Yangi test uchun
    lsKey.value = "questions_new";
    loadQuestionsFromLS();
  }
});
// --- Testni saqlash ---
const saveTest = async () => {
  try {
    if (test.value?._id) {
      await api.put(`/tests/${test.value._id}`, form.value);
      toast.add({ severity: "success", summary: "Yangilandi", detail: "Test yangilandi", life: 3000 });
    } else {
      await api.post("/tests", form.value);
      toast.add({ severity: "success", summary: "Muvaffaqiyat", detail: "Yangi test qo‘shildi",life: 3000 });
    }
    // LocalStorage tozalash
    localStorage.removeItem(lsKey.value);
    router.push({ name: "Tests" });
  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: err.response?.data?.message || err.message , life: 3000 });
  }
};

const handleCancel = () => {
  localStorage.removeItem(lsKey.value);
  router.back();
};

</script>