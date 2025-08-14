<template>
  <div class="p-4 shadow-lg bg-white rounded-lg">
    <div class="flex items-center gap-3 mb-2">
     <div class="w-full flex items-center justify-between">
      <div class="flex items-center gap-3 mb-2">
         <Avatar 
        :label="student.name.charAt(0) + student.lastname.charAt(0)"
        class="bg-blue-100 text-blue-800"
        size="normal"
      />
      <div class="flex-1">
        <div class="font-semibold text-gray-800 text-lg">
          {{ student.name }} {{ student.lastname }}
        </div>
        <div class="text-sm text-gray-500">ID: {{ student._id.slice(-6) }}</div>
      </div>
      </div>
      <span @click="openMessageModal(student)">
        <i class="pi pi-envelope text-gray-500 cursor-pointer hover:text-gray-600"></i>
      </span>
     </div>
    </div>
    <div class="grid grid-cols-3 gap-4 text-center">
      <label class="flex flex-col items-center cursor-pointer" v-for="option in statusOptions" :key="option.value">
        <RadioButton 
          v-model="modelValue[student._id]" 
          :inputId="option.value + '-' + student._id" 
          :value="option.value" 
          class="mb-1"
          :aria-label="option.label + ' ' + student.name" 
        />
        <i :class="[option.icon, option.color, 'text-2xl']"></i>
        <span :class="option.color">{{ option.label }}</span>
      </label>
    </div>
  </div>
     <!-- Send Message Modal -->
<Dialog
  v-model:visible="sendMessageModalVisible"
  :modal="true"
  :closable="false"
  :draggable="false"
  :style="{ width: '450px' }"
  :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
>
  <template #header>
    <div class="flex items-center">
      <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
        <i class="pi pi-envelope text-blue-600 text-xl"></i>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-800 m-0">{{ changeStudent.name }} {{ changeStudent.lastname }} ga xabar yuborish</h3>
        <p class="text-sm text-gray-500 m-0 mt-1">
          Xabar matnini kiriting va yuboring
        </p>
      </div>
    </div>
  </template>

  <div class="py-4">
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start flex-col gap-2">
        <div class="flex items-center justify-center gap-1">
          <i class="pi pi-info-circle text-blue-500 "></i>
           <label class="text-sm font-medium text-gray-700  block">
            Xabar matni <span class="text-red-500">*</span>
          </label>
        </div>
        <div class="flex-1 w-full">
          <Textarea
            v-model="messageText"
            placeholder="Yuboriladigan xabar..."
            class="w-full"
            rows="4"
            autoResize
            :class="{ 'p-invalid': !messageText && showValidation }"
          />
          <small v-if="!messageText && showValidation" class="text-red-500">
            Xabar matni majburiy
          </small>
        </div>
      </div>
    </div>
  </div>

  <template #footer>
    <div class="flex justify-end gap-3">
      <Button
        label="Bekor qilish"
        icon="pi pi-times"
        severity="secondary"
        @click="sendMessageModalVisible = false"
      />
      <Button
        :label="isLoading ? 'Yuborilmoqda...' : 'Xabar yuborish'"
        icon="pi pi-send"
        class="bg-blue-500 border-blue-500 hover:bg-blue-600"
        :loading="isLoading"
        @click="sendMessageFunction()"
      />
    </div>
  </template>
</Dialog>
   <Toast style="width: 300px;"/>
</template>

<script setup>
import { ref, computed } from 'vue'
import Avatar from 'primevue/avatar';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import api from "../../utils/api.js"

const toast = useToast()
const sendMessageModalVisible=ref(false)
const isLoading=ref(false)
const showValidation = ref(false)
const changeStudent=ref()
const messageText=ref('')

const openMessageModal = (item) => {
  sendMessageModalVisible.value = true
  changeStudent.value = item
  console.log(changeStudent.value)
}

const sendMessageFunction = async () => {
  isLoading.value=true
  try {
    const res = await api.post("/students/send-message", {
      studentId: changeStudent.value._id,
      message: messageText.value
    });

    if (res.status >= 200 && res.status < 300) {
      sendMessageModalVisible.value = false;
      toast.add({
        severity: 'success',
        summary: 'Muvaffaqiyatli',
        detail: "Xabar yuborildi ✅",
        life: 3000,
      });
      messageText.value = '';
      isLoading.value=false
      changeStudent.value = null;
    }
  } catch (err) {
    isLoading.value=false
    console.error("Xabar yuborishda xatolik:", err);
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: "Xabar yuborib bo‘lmadi ❌",
      life: 3000,
    });
  }
};
defineProps({
  student: Object,
  modelValue: Object
});

defineEmits(['update:modelValue']);

const statusOptions = [
  { value: 'present', label: 'Bor', icon: 'pi pi-check-circle', color: 'text-green-600' },
  { value: 'absent', label: "Yo'q", icon: 'pi pi-times-circle', color: 'text-red-600' },
  { value: 'late', label: 'Kechikdi', icon: 'pi pi-clock', color: 'text-yellow-500' }
];
</script>
