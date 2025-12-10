<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      {{ test?._id ? 'Testni Tahrirlash' : 'Yangi Test' }}
    </h1>

    <div class="grid gap-4">
      <!-- Test nomi -->
      <div>
        <label class="block mb-1">Test Nomi</label>
        <InputText v-model="form.title" class="w-full" />
      </div>

      <!-- Fan tanlash -->
      <div>
        <label class="block mb-1">Fan</label>
        <Dropdown
          v-model="form.subjectId"
          :options="subjects"
          optionLabel="name"
          optionValue="_id"
          placeholder="Fanni tanlang"
          class="w-full"
        />
      </div>

      <!-- Tavsif -->
      <div>
        <label class="block mb-1">Tavsif</label>
        <InputText v-model="form.description" class="w-full" />
      </div>

      <!-- Savollar -->
      <div>
        <h3 class="font-semibold mb-2">Savollar</h3>

        <div
          v-for="(q, index) in form.questions"
          :key="index"
          class="border p-2 rounded mb-2"
        >
          <div class="flex justify-between items-center mb-1">
            <span>Savol {{ index + 1 }}</span>
            <Button
              icon="pi pi-trash"
              class="p-button-sm p-button-danger"
              @click="removeQuestion(index)"
            />
          </div>

          <!-- Savol uchun Editor -->
          <Editor v-model="q.question" placeholder="Savol matni" class="w-full mb-2" />

          <!-- Ball -->
  <div class="mb-2">
    <label class="mb-1 font-semibold">Ball</label>
    <InputText 
      type="number" 
      v-model.number="form.questions[index].points" 
      placeholder="Ball" 
      class="w-full" 
      min="1"
    />
  </div>
          <!-- Javob variantlari -->
          <div
            v-for="(opt, i) in q.options"
            :key="i"
            class="flex gap-2 mb-2 items-center"
          >
            <Editor v-model="q.options[i]" placeholder="Javob varianti" class="flex-1" />
            <Button
              icon="pi pi-trash"
              class="p-button-sm p-button-danger"
              @click="removeOption(index, i)"
            />
          </div>

          <Button
            label="Variant qo‘shish"
            icon="pi pi-plus"
            class="p-button-sm mt-1"
            @click="addOption(index)"
          />
          <Dropdown
            v-model="q.correctAnswer"
            :options="q.options"
            placeholder="To‘g‘ri javobni tanlang"
            class="mt-1 w-full"
          />
        </div>

        <Button
          label="Savol qo‘shish"
          icon="pi pi-plus"
          class="mt-2"
          @click="addQuestion"
        />
      </div>
    </div>

    <!-- Tugmalar -->
    <div class="mt-4 flex gap-2">
      <Button label="Bekor qilish" icon="pi pi-times" class="p-button-text" @click="$router.back()" />
      <Button label="Saqlash" icon="pi pi-check" @click="saveTest" />
    </div>

    <Toast  />
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
const form = ref({ title: "", subjectId: null, description: "", questions: [], points: null});

// Load subjects
const loadSubjects = async () => {
  try {
    const res = await api.get("/subjects");
    subjects.value = res.data;
  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: err.message });
  }
};

// Edit mode
onMounted(async () => {
  await loadSubjects();
  if (route.params.id) {
    try {
      const res = await api.get(`/tests/${route.params.id}`);
      test.value = res.data;
      form.value = {
        title: test.value.title,
        subjectId: test.value.subjectId._id,
        description: test.value.description,
        questions: JSON.parse(JSON.stringify(test.value.questions)),
      };
    } catch (err) {
      toast.add({ severity: "error", summary: "Xato", detail: err.message });
    }
  }
});

// Question handlers
const addQuestion = () => form.value.questions.push({ question: "", options: [], correctAnswer: "" });
const removeQuestion = (i) => form.value.questions.splice(i, 1);
const addOption = (qIndex) => form.value.questions[qIndex].options.push("");
const removeOption = (qIndex, oIndex) => form.value.questions[qIndex].options.splice(oIndex, 1);

// Save test
const saveTest = async () => {
  try {
    if (test.value?._id) {
      await api.put(`/tests/${test.value._id}`, form.value);
      toast.add({ severity: "success", summary: "Muvaffaqiyat", detail: "Test yangilandi" });
    } else {
      await api.post("/tests", form.value);
      toast.add({ severity: "success", summary: "Muvaffaqiyat", detail: "Yangi test qo'shildi" });
    }
    router.push({ name: "Tests" });
  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: err.response?.data?.message || err.message });
  }
};
</script>
