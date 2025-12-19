<template>
  <div class="p-2">
    <h1 class="text-2xl font-bold mb-4">Testlar</h1>
  <Button
  label="Yangi Test"
  icon="pi pi-plus"
  class="mb-4"
  @click="$router.push({ name: 'AddTest' })"
/>


    <!-- Testlar jadvali -->
    <TestTable
      :tests="tests"
      :user-id="userId"
      @edit-test="editTest"
      @delete-test="deleteTest"
    />

    <!-- Toast -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import api from "@/utils/api.js";

import TestTable from "@/components/Tests/TestTable.vue";

// States
const tests = ref([]);
const subjects = ref([]);
const testDialog = ref(false);
const editingTest = ref(null);
const toast = useToast();
const userId = ref(localStorage.getItem("userId") || "");

// Load data
const loadSubjects = async () => {
  try {
    const res = await api.get("/subjects");
    subjects.value = res.data;
  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: err.message,life: 3000 });
  }
};

const loadTests = async () => {
  try {
    const res = await api.get("/tests");
    tests.value = res.data;
    console.log(res.data);
  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: err.message,life: 3000 });
  }
};

// Dialog functions
const openNewTestDialog = () => {
  editingTest.value = null;
  testDialog.value = true;
};

const editTest = (test) => {
  editingTest.value = { ...test, subjectId: test.subjectId._id, questions: JSON.parse(JSON.stringify(test.questions)) };
  testDialog.value = true;
};

// CRUD save/delete
const saveTest = async (formData) => {
  try {
    if (editingTest.value?._id) {
      await api.put(`/tests/${editingTest.value._id}`, formData);
      toast.add({ severity: "success", summary: "Muvaffaqiyat", detail: "Test yangilandi",life: 3000 });
    } else {
      await api.post("/tests", formData);
      toast.add({ severity: "success", summary: "Muvaffaqiyat", detail: "Yangi test qo'shildi",life: 3000 });
    }
    testDialog.value = false;
    await loadTests();
  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: err.response?.data?.message || err.message,life: 3000 });
  }
};

const deleteTest = async (test) => {
  if (!confirm("Testni o‘chirilsinmi?")) return;
  try {
    await api.delete(`/tests/${test._id}`);
    toast.add({ severity: "success", summary: "Muvaffaqiyat", detail: "Test o‘chirildi",life: 3000 });
    await loadTests();
  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: err.response?.data?.message || err.message,life: 3000 });
  }
};

onMounted(() => {
  loadSubjects();
  loadTests();
});
</script>
