<template>
  <Card class="shadow-lg">
    <template #header>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2 p-4 pb-0">
          <i class="pi pi-calendar text-xl text-blue-600"></i>
          <h3 class="text-xl font-semibold text-gray-800">
            Sana Tanlash
          </h3>
        </div>

        <div class="p-4">
          <Button
            label="Xabar yuborish"
            icon="pi pi-envelope"
            class="w-full sm:w-auto"
            @click="visible = true"
          />
        </div>
      </div>
    </template>

    <template #content>
      <div class="flex flex-col gap-4 p-4">
        <label class="font-medium text-gray-700">
          Davomat sanasi:
        </label>

        <Calendar
          v-model="value"
          dateFormat="dd/mm/yy"
          :maxDate="new Date()"
          showIcon
          iconDisplay="input"
          class="w-full max-w-xs"
          placeholder="Sanani tanlang"
        />
      </div>
    </template>
  </Card>

  <!-- Guruhga xabar yuborish -->
  <Dialog
    v-model:visible="visible"
    modal
    header="Guruhga xabar yuborish"
    class="w-full max-w-lg"
  >
  <div class="p-2 bg-orange-500/20 rounded">
    <span class="text-orange-600">Buyerda yoziladigan xabar guruhdagi barcha o'quvchilarga yuboriladi!</span>
  </div>
    <div class="flex flex-col gap-4">
      <Textarea
        v-model="form.message"
        rows="5"
        placeholder="Xabar matnini kiriting..."
        class="w-full"
      />

      <Button
        label="Xabar yuborish"
        icon="pi pi-send"
        :loading="loading"
        class="w-full"
        @click="groupSendMessage"
      />
    </div>
  </Dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import Card from "primevue/card";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import api from "@/utils/api.js";

// 🔹 route
const route = useRoute();
const groupId = route.params.id || route.params.groupId;
// agar routerda :id bo‘lsa — id ishlaydi

// 🔹 Props (calendar uchun)
const props = defineProps({
  modelValue: Date,
});

const emit = defineEmits(["update:modelValue"]);

// 🔹 Calendar v-model
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// 🔹 State
const visible = ref(false);
const loading = ref(false);

const form = ref({
  message: "",
});

// 🔹 Guruhga xabar yuborish
const groupSendMessage = async () => {
  if (!form.value.message) {
    return alert("Xabar matnini kiriting");
  }

  if (!groupId) {
    return alert("groupId URL'dan topilmadi");
  }

  try {
    loading.value = true;

    await api.post("students/send-group-message", {
      groupId,
      message: form.value.message,
    });

    alert("Xabar yuborildi ✅");

    form.value.message = "";
    visible.value = false;
  } catch (error) {
    alert(error.response?.data?.error || "Xatolik yuz berdi");
  } finally {
    loading.value = false;
  }
};
</script>
