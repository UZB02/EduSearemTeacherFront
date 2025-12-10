<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Mening Fanlarim</h1>

    <!-- Yangi fan qo'shish tugmasi -->
    <Button
      label="Yangi Fan Qo'shish"
      icon="pi pi-plus"
      class="mb-4"
      @click="openNewSubjectDialog"
    />

    <!-- Fanlar jadvali -->
    <SubjectTable
      :subjects="subjects"
      @edit-subject="editSubject"
      @delete-subject="confirmDeleteSubject"
    />

    <!-- Yangi/Tahrirlash Dialog -->
    <SubjectForm
      v-model:visible="subjectDialog"
      :subject="editingSubject"
      @save="saveSubject"
    />

    <!-- Toast va ConfirmDialog -->
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

// Components
import SubjectForm from "@/components/Subjects/SubjectForm.vue";
import SubjectTable from "@/components/Subjects/SubjectTable.vue";

// Reactive states
const subjects = ref([]);
const subjectDialog = ref(false);
const editingSubject = ref(null);

// Toast & Confirm
const toast = useToast();
const confirm = useConfirm();

// Load subjects
const loadSubjects = async () => {
  try {
    const res = await api.get("/subjects");
    subjects.value = res.data;
  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: err.message });
  }
};

// New Subject
const openNewSubjectDialog = () => {
  editingSubject.value = null;
  subjectDialog.value = true;
};

// Edit Subject
const editSubject = (subject) => {
  editingSubject.value = { ...subject };
  subjectDialog.value = true;
};

// Save Subject
const saveSubject = async (formData) => {
  try {
    if (editingSubject.value?._id) {
      await api.put(`/subjects/${editingSubject.value._id}`, formData);
      toast.add({ severity: "success", summary: "Muvaffaqiyat", detail: "Fan yangilandi" });
    } else {
      await api.post("/subjects", formData);
      toast.add({ severity: "success", summary: "Muvaffaqiyat", detail: "Yangi fan qo'shildi" });
    }
    subjectDialog.value = false;
    await loadSubjects();
  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: err.response?.data?.message || err.message });
  }
};

// Confirm Delete
const confirmDeleteSubject = (subject) => {
  confirm.require({
    message: "Fan o‘chirilsinmi?",
    header: "Tasdiqlash",
    icon: "pi pi-exclamation-triangle",
    accept: async () => {
      try {
        await api.delete(`/subjects/${subject._id}`);
        toast.add({ severity: "success", summary: "Muvaffaqiyat", detail: "Fan o‘chirildi" });
        await loadSubjects();
      } catch (err) {
        toast.add({ severity: "error", summary: "Xato", detail: err.response?.data?.message || err.message });
      }
    },
  });
};

// On Mounted
onMounted(loadSubjects);
</script>
