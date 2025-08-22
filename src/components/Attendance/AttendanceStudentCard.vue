<template>
  <div class="p-4 shadow-lg bg-white rounded-lg">
    <!-- Student card -->
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

        <!-- Actions -->
        <div class="flex gap-3">
          <i
            class="pi pi-envelope text-gray-500 cursor-pointer hover:text-gray-600"
            @click="openMessageModal(student)"
          ></i>
          <i
            class="pi pi-star text-yellow-500 cursor-pointer hover:text-yellow-600"
            @click="openPointModal(student)"
          ></i>
        </div>
      </div>
    </div>

    <!-- Status options -->
    <div class="grid grid-cols-3 gap-4 text-center">
      <label
        class="flex flex-col items-center cursor-pointer"
        v-for="option in statusOptions"
        :key="option.value"
      >
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
          <h3 class="text-lg font-semibold text-gray-800 m-0">
            {{ changeStudent?.name }} {{ changeStudent?.lastname }} ga xabar yuborish
          </h3>
          <p class="text-sm text-gray-500 m-0 mt-1">Xabar matnini kiriting va yuboring</p>
        </div>
      </div>
    </template>

    <div class="py-4">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start flex-col gap-2">
          <div class="flex items-center justify-center gap-1">
            <i class="pi pi-info-circle text-blue-500"></i>
            <label class="text-sm font-medium text-gray-700 block">
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
          :label="isMessageLoading ? 'Yuborilmoqda...' : 'Xabar yuborish'"
          icon="pi pi-send"
          class="bg-blue-500 border-blue-500 hover:bg-blue-600"
          :loading="isMessageLoading"
          @click="sendMessageFunction()"
        />
      </div>
    </template>
  </Dialog>

  <!-- Add Point Modal -->
  <Dialog
    v-model:visible="addPointModalVisible"
    :modal="true"
    :closable="false"
    :draggable="false"
    :style="{ width: '460px' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
  >
    <!-- Header -->
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <i class="pi pi-star text-green-600 text-xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800 m-0">
            {{ changeStudent?.name }} {{ changeStudent?.lastname }} ga ball qo‘shish
          </h3>
          <p class="text-sm text-gray-500 m-0 mt-1">
            Ball miqdorini kiriting va (xohlasa) izoh qo‘shing
          </p>
        </div>
      </div>
    </template>

    <!-- Body -->
    <div class="py-4">
      <div class="flex flex-col gap-4">
        <!-- Point input -->
        <div>
          <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <i class="pi pi-info-circle text-green-500"></i>
            Ball miqdori <span class="text-red-500">*</span>
          </label>
          <InputNumber
            v-model="pointValue"
            placeholder="Masalan: 10"
            class="w-full"
            :min="1"
            :class="{ 'p-invalid': !pointValue && showValidation }"
          />
          <small v-if="!pointValue && showValidation" class="text-red-500">
            Ball kiritish majburiy
          </small>
        </div>

        <!-- Description -->
        <div>
          <label class="text-sm font-medium text-gray-700 mb-2 block"> Izoh (ixtiyoriy) </label>
          <Textarea
            v-model="descriptionText"
            placeholder="Yuboriladigan xabar..."
            class="w-full"
            rows="3"
            autoResize
          />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex justify-end gap-3">
        <Button
          label="Bekor qilish"
          icon="pi pi-times"
          severity="secondary"
          @click="addPointModalVisible = false"
        />
        <Button
          :label="isPointLoading ? 'Saqlanmoqda...' : 'Ball qo‘shish'"
          icon="pi pi-check"
          class="bg-green-500 border-green-500 hover:bg-green-600"
          :loading="isPointLoading"
          :disabled="isPointLoading"
          @click="addPointFunction()"
        />
      </div>
    </template>
  </Dialog>

  <!-- Toast -->
  <Toast style="width: 300px" />
</template>

<script setup>
import { ref } from 'vue'
import Avatar from 'primevue/avatar'
import RadioButton from 'primevue/radiobutton'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import api from '../../utils/api.js'

const toast = useToast()

const sendMessageModalVisible = ref(false)
const addPointModalVisible = ref(false)

const isMessageLoading = ref(false)
const isPointLoading = ref(false)

const showValidation = ref(false)
const changeStudent = ref(null)

const messageText = ref('')
const pointValue = ref()
const descriptionText = ref('')

const openMessageModal = (item) => {
  sendMessageModalVisible.value = true
  changeStudent.value = item
}

const openPointModal = (item) => {
  addPointModalVisible.value = true
  changeStudent.value = item
}

const sendMessageFunction = async () => {
  showValidation.value = true
  if (!messageText.value) return

  isMessageLoading.value = true
  try {
    const res = await api.post('/students/send-message', {
      studentId: changeStudent.value._id,
      message: messageText.value,
    })

    if (res.status >= 200 && res.status < 300) {
      sendMessageModalVisible.value = false
      toast.add({
        severity: 'success',
        summary: 'Muvaffaqiyatli',
        detail: 'Xabar yuborildi ✅',
        life: 3000,
      })
      messageText.value = ''
      changeStudent.value = null
    }
  } catch (err) {
    console.error('Xabar yuborishda xatolik:', err)
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: 'Xabar yuborib bo‘lmadi ❌',
      life: 3000,
    })
  } finally {
    isMessageLoading.value = false
  }
}

const addPointFunction = async () => {
  showValidation.value = true
  if (!pointValue.value) return
  console.log(changeStudent.value._id, 'Student Id', descriptionText.value, pointValue.value)
  isPointLoading.value = true
  try {
    const res = await api.post('/progress', {
      studentId: changeStudent.value._id,
      teacherFeedback: pointValue.value,
      description: descriptionText.value,
    })

    if (res.status >= 200 && res.status < 300) {
      addPointModalVisible.value = false
      toast.add({
        severity: 'success',
        summary: 'Muvaffaqiyatli',
        detail: 'Ball qo‘shildi ✅',
        life: 3000,
      })
      pointValue.value = null
      changeStudent.value = null
    }
  } catch (err) {
    console.error('Ball qo‘shishda xatolik:', err)
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: 'Ball qo‘shib bo‘lmadi ❌',
      life: 3000,
    })
  } finally {
    isPointLoading.value = false
  }
}

defineProps({
  student: Object,
  modelValue: Object,
})

defineEmits(['update:modelValue'])

const statusOptions = [
  {
    value: 'present',
    label: 'Bor',
    icon: 'pi pi-check-circle',
    color: 'text-green-600',
  },
  {
    value: 'absent',
    label: "Yo'q",
    icon: 'pi pi-times-circle',
    color: 'text-red-600',
  },
  {
    value: 'late',
    label: 'Kechikdi',
    icon: 'pi pi-clock',
    color: 'text-yellow-500',
  },
]
</script>
