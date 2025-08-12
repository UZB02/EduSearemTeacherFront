<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h2 class="text-2xl font-bold text-center mb-4">O‘qituvchi kirishi</h2>
      <!-- Telefon raqam -->
      <div class="mb-4">
        <label class="block mb-1 text-sm font-medium text-gray-700">Telefon raqami</label>
        <InputText
          v-model="phone"
          placeholder="+998 XX XXX XX XX"
          class="w-full"
        />
      </div>

      <!-- Kirish tugmasi -->
      <Button
        label="Kirish"
        class="w-full"
        :loading="loading"
        @click="login"
      />

      <!-- Xabar -->
      <p v-if="error" class="mt-3 text-red-500 text-sm">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useRouter } from "vue-router";

const phone = ref("");
const loading = ref(false);
const error = ref("");
const router = useRouter();

const login = async () => {
  error.value = "";
  if (!phone.value) {
    error.value = "Telefon raqamini kiriting";
    return;
  }

  try {
    loading.value = true;
    const res = await axios.post("/teacher-auth/login", {
      phone: phone.value,
    });

    sessionStorage.setItem("teacherToken", res.data.token);
    sessionStorage.setItem("teacherData", JSON.stringify(res.data.teacher));

    router.push("/");
  } catch (err) {
    error.value =
      err.response?.data?.message || "Kirishda xatolik yuz berdi";
  } finally {
    loading.value = false;
  }
};
</script>


<style scoped>
</style>
