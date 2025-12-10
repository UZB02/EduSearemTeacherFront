<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="subject?._id ? 'Fanni Tahrirlash' : 'Yangi Fan'"
    modal
    class="w-1/2"
  >
    <div class="grid gap-4">
      <div>
        <label class="block mb-1">Fan Nomi</label>
        <InputText v-model="form.name" class="w-full" />
      </div>
      <div>
        <label class="block mb-1">Kod</label>
        <InputText v-model="form.code" class="w-full" />
      </div>
      <div>
        <label class="block mb-1">Tavsif</label>
        <InputText v-model="form.description" class="w-full" />
      </div>
    </div>
    <template #footer>
      <Button label="Bekor qilish" icon="pi pi-times" class="p-button-text" @click="$emit('update:visible', false)" />
      <Button label="Saqlash" icon="pi pi-check" @click="save" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

const props = defineProps({
  subject: Object,
  visible: Boolean
});
const emit = defineEmits(["update:visible", "save"]);

const form = ref({
  name: "",
  code: "",
  description: "",
});

// Prop subject o'zgarganda formni yangilash
watch(() => props.subject, (val) => {
  form.value = val ? { ...val } : { name: "", code: "", description: "" };
});

// Save
const save = () => {
  emit("save", { ...form.value });
};
</script>
