<template>
  <div class="p-3 sm:p-4 md:p-6 max-w-6xl mx-auto">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row
             sm:items-center sm:justify-between
             gap-3 mb-4"
    >
      <h1
        class="text-xl sm:text-2xl font-bold"
      >
        Mening Fanlarim
      </h1>

      <!-- New subject -->
      <Button
        label="Yangi Fan Qo'shish"
        icon="pi pi-plus"
        class="w-full sm:w-auto"
        @click="openNewSubjectDialog"
      />
    </div>

    <!-- Table -->
    <SubjectTable
      :subjects="subjects"
      @edit-subject="editSubject"
      @delete-subject="confirmDeleteSubject"
    />

    <!-- Dialog -->
    <SubjectForm
      v-model:visible="subjectDialog"
      :subject="editingSubject"
    />

    <!-- Toast & Confirm -->
    <Toast />
    <ConfirmDialog />
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import api from "@/utils/api.js";

// PrimeVue
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";

// Components
import SubjectForm from "@/components/Subjects/SubjectForm.vue";
import SubjectTable from "@/components/Subjects/SubjectTable.vue";

const subjects = ref([]);
const subjectDialog = ref(false);
const editingSubject = ref(null);

const toast = useToast();
const confirm = useConfirm();

// Load
const loadSubjects = async () => {
  try {
    const res = await api.get("/subjects");
    subjects.value = res.data;
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Xato",
      detail: err.message,
    });
  }
};

// New
const openNewSubjectDialog = () => {
  editingSubject.value = null;
  subjectDialog.value = true;
};

// Edit
const editSubject = (subject) => {
  editingSubject.value = { ...subject };
  subjectDialog.value = true;
};

// Save
const saveSubject = async (formData) => {
  try {
    if (editingSubject.value?._id) {
      await api.put(
        `/subjects/${editingSubject.value._id}`,
        formData
      );
      toast.add({
        severity: "success",
        summary: "Muvaffaqiyat",
        detail: "Fan yangilandi",
      });
    } else {
      await api.post("/subjects", formData);
      toast.add({
        severity: "success",
        summary: "Muvaffaqiyat",
        detail: "Yangi fan qo'shildi",
      });
    }

    subjectDialog.value = false;
    await loadSubjects();
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Xato",
      detail: err.response?.data?.message || err.message,
    });
  }
};

// Delete
const confirmDeleteSubject = (subject) => {
  confirm.require({
    message: "Fan o‘chirilsinmi?",
    header: "Tasdiqlash",
    icon: "pi pi-exclamation-triangle",
    accept: async () => {
      try {
        await api.delete(`/subjects/${subject._id}`);
        toast.add({
          severity: "success",
          summary: "Muvaffaqiyat",
          detail: "Fan o‘chirildi",
        });
        await loadSubjects();
      } catch (err) {
        toast.add({
          severity: "error",
          summary: "Xato",
          detail:
            err.response?.data?.message || err.message,
        });
      }
    },
  });
};

onMounted(loadSubjects);
</script>
