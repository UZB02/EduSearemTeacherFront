<template>
  <div class="flex flex-col gap-2">
    <Button
      label="Unikal havola yaratish"
      icon="pi pi-link"
      class="p-button-primary"
      @click="generateLink"
    />
    <Button
      label="Yangi savol qo'shish"
      icon="pi pi-plus"
      class="p-button-success"
      @click="$emit('add-question')"
    />
    <Button
      label="Natijalarni ko‘rish"
      icon="pi pi-chart-line"
      class="p-button-info"
      @click="$emit('view-results')"
    />
    <div v-if="link" class="mt-2 flex items-center gap-2">
      <span class="break-all">{{ link }}</span>
      <Button icon="pi pi-copy" class="p-button-secondary p-button-sm" @click="copyLink" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import api from "@/utils/api.js";

const props = defineProps({
  testId: String,
  link: String,
});

const emit = defineEmits(["link-generated"]);

const toast = useToast();
const link = ref(props.link);

// Havola yaratish
const generateLink = async () => {
  try {
    const res = await api.post(`/tests/${props.testId}/generate-link`);
    link.value = res.data.link;
    emit("link-generated", link.value);
    toast.add({ severity: "success", summary: "Muvaffaqiyat", detail: "Havola yaratildi",life: 3000 });
  } catch (err) {
    toast.add({ severity: "error", summary: "Xato", detail: err.response?.data?.message || err.message,life: 3000 });
  }
};

// Clipboardga nusxalash
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(link.value);
    toast.add({ severity: "success", summary: "Muvaffaqiyat", detail: "Havola nusxalandi",life: 3000 });
  } catch {
    toast.add({ severity: "error", summary: "Xato", detail: "Havola nusxalanmadi",life: 3000 });
  }
};
</script>
