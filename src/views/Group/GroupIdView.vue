<template>
  <div class="container mx-auto">
    <AttendanceHeader :group="group" />

    <Message v-if="error" severity="error" class="mb-6">
      <i class="pi pi-exclamation-triangle mr-2"></i>
      {{ error }}
    </Message>

    <div v-if="loading" class="text-center py-8">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      <p class="mt-4 text-gray-600">Yuklanmoqda...</p>
    </div>

    <div v-if="!loading && group" class="space-y-6">
      <DateSelector v-model="attendanceDate" />

      <div class="space-y-4">
        <AttendanceStudentCard
          v-for="student in group.students"
          :key="student._id"
          :student="student"
          v-model="attendanceRecords"
        />
      </div>

      <div class="flex justify-end mt-6">
        <Button
          type="submit"
          label="Davomatni Saqlash"
          icon="pi pi-save"
          :loading="submitLoading"
          loadingIcon="pi pi-spin pi-spinner"
          severity="success"
          @click="submitAttendance"
        />
      </div>

      <AttendanceHistory :history="attendanceHistory" />
    </div>

    <Toast style="width: 300px;"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

// Components
import AttendanceHeader from '@/components/Attendance/AttendanceHeader.vue';
import DateSelector from '@/components/Attendance/DateSelector.vue';
import AttendanceStudentCard from '@/components/Attendance/AttendanceStudentCard.vue';
import AttendanceHistory from '@/components/Attendance/AttendanceHistory.vue';
import api from '../../utils/api.js'

const router = useRouter();
const toast = useToast();

const group = ref(null);
const loading = ref(false);
const error = ref("");
const submitLoading = ref(false);

const groupId = router.currentRoute.value.params.id;
const attendanceRecords = ref({});
const attendanceHistory = ref([]);
const attendanceDate = ref(new Date());

const fetchGroup = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/attendance/${groupId}`);
    group.value = res.data;
    group.value.students.forEach(student => {
      attendanceRecords.value[student._id] = 'present';
    });
  } catch (e) {
    error.value = e.response?.data?.message || "Xatolik yuz berdi";
  } finally {
    loading.value = false;
  }
};

const fetchAttendanceHistory = async () => {
  try {
    const res = await api.get(`/attendance/history/${groupId}`)
    attendanceHistory.value = res.data
  } catch (e) {
    error.value = e.response?.data?.message || "Davomat tarixini olishda xatolik yuz berdi"
  }
}

const submitAttendance = async () => {
  submitLoading.value = true;
  const formattedDate = attendanceDate.value instanceof Date
    ? attendanceDate.value.toISOString()
    : null;

  if (!formattedDate) {
    error.value = "Iltimos, sanani tanlang";
    submitLoading.value = false;
    return;
  }

  try {
    const recordsPayload = group.value.students.map((student) => ({
      studentId: student._id,
      status: attendanceRecords.value[student._id] || "present",
    }));
    await api.post(
      "/attendance/mark",
      { date: formattedDate, records: recordsPayload, groupId }
    );

    toast.add({ severity: 'success', summary: 'Muvaffaqiyat', detail: 'Davomat saqlandi!', life: 3000 });
    fetchAttendanceHistory();
  } catch (e) {
    const errorMessage = e.response?.data?.message || "Saqlashda xatolik yuz berdi";
    error.value = errorMessage;
    toast.add({ severity: 'error', summary: 'Xatolik', detail: errorMessage, life: 5000 });
  } finally {
    submitLoading.value = false;
  }
};

onMounted(() => {
  fetchGroup();
  fetchAttendanceHistory();
});
</script>
