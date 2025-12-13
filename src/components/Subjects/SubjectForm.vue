<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="subject?._id ? 'Fanni tahrirlash' : 'Yangi fan'"
    modal
    :breakpoints="{
      '960px': '70vw',
      '640px': '95vw'
    }"
    class="w-[40vw]"
  >
    <!-- Form -->
    <div class="grid gap-4 sm:gap-5">
      <div>
        <label class="block mb-1 text-sm font-medium">
          Fan nomi
        </label>
        <InputText
          v-model="form.name"
          class="w-full"
        />
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">
          Kod
        </label>
        <InputText
          v-model="form.code"
          class="w-full"
        />
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">
          Tavsif
        </label>
        <InputText
          v-model="form.description"
          class="w-full"
        />
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div
        class="flex flex-col sm:flex-row
               justify-end gap-2"
      >
        <Button
          label="Bekor qilish"
          icon="pi pi-times"
          class="p-button-text w-full sm:w-auto"
          @click="$emit('update:visible', false)"
        />

        <Button
          label="Saqlash"
          icon="pi pi-check"
          class="w-full sm:w-auto"
          @click="save"
        />
      </div>
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
  visible: Boolean,
});

const emit = defineEmits(["update:visible", "save"]);

const form = ref({
  name: "",
  code: "",
  description: "",
});

// Subject o‘zgarsa formni yangilash
watch(
  () => props.subject,
  (val) => {
    form.value = val
      ? { ...val }
      : { name: "", code: "", description: "" };
  },
  { immediate: true }
);

// Save
const save = () => {
  emit("save", { ...form.value });
};
</script>
