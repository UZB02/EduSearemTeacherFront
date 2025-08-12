<template>
  <div class="">
    <div class="container mx-auto">
      <!-- Header Card -->
      <Card class="mb-6 shadow-lg">
        <template #content>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="pi pi-users text-3xl text-blue-600"></i>
              <div>
                <h1 class="text-2xl font-bold text-gray-800 mb-1">Guruhdagi O'quvchilar Davomati</h1>
                <p class="text-gray-600">{{ group ? group.name : '' }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-500">Bugungi sana</div>
              <div class="text-md font-semibold text-gray-800">{{ formatDate(new Date()) }}</div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Loading State -->
      <Card v-if="loading" class="text-center py-8">
        <template #content>
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
          <p class="mt-4 text-gray-600">Yuklanmoqda...</p>
        </template>
      </Card>

      <!-- Error State -->
      <Message v-if="error" severity="error" class="mb-6">
        <i class="pi pi-exclamation-triangle mr-2"></i>
        {{ error }}
      </Message>

      <!-- Main Content -->
      <div v-if="!loading && group" class="space-y-6">
        <!-- Date Selection Card -->
        <Card class="shadow-lg">
          <template #header>
            <div class="flex items-center gap-2 p-4 pb-0">
              <i class="pi pi-calendar text-xl text-blue-600"></i>
              <h3 class="text-xl font-semibold text-gray-800">Sana Tanlash</h3>
            </div>
          </template>
          <template #content>
            <div class="flex  flex-col gap-4 p-4">
              <label class="font-medium text-gray-700 whitespace-nowrap">Davomat sanasi:</label>
              <Calendar 
                v-model="attendanceDate" 
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

        <!-- Attendance Form Cards as List -->
        <div class="space-y-4">
          <div v-for="student in group.students" :key="student._id" class="p-4 shadow-lg bg-white rounded-lg">
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
            <div class="grid grid-cols-3 gap-4 text-center">
              <label class="flex flex-col items-center cursor-pointer">
                <RadioButton 
                  v-model="attendanceRecords[student._id]" 
                  :inputId="'present-' + student._id" 
                  value="present" 
                  class="mb-1"
                  aria-label="'Bor ' + student.name" 
                />
                <i class="pi pi-check-circle text-green-600 text-2xl"></i>
                <span class="text-green-600">Bor</span>
              </label>
              <label class="flex flex-col items-center cursor-pointer">
                <RadioButton 
                  v-model="attendanceRecords[student._id]" 
                  :inputId="'absent-' + student._id" 
                  value="absent" 
                  class="mb-1"
                  aria-label="'Yo‘q ' + student.name" 
                />
                <i class="pi pi-times-circle text-red-600 text-2xl"></i>
                <span class="text-red-600">Yo'q</span>
              </label>
              <label class="flex flex-col items-center cursor-pointer">
                <RadioButton 
                  v-model="attendanceRecords[student._id]" 
                  :inputId="'late-' + student._id" 
                  value="late" 
                  class="mb-1"
                  aria-label="'Kechikdi ' + student.name" 
                />
                <i class="pi pi-clock text-yellow-500 text-2xl"></i>
                <span class="text-yellow-500">Kechikdi</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end mt-6">
          <Button
            type="submit"
            label="Davomatni Saqlash"
            icon="pi pi-save"
            :loading="submitLoading"
            loadingIcon="pi pi-spin pi-spinner"
            class="px-6 py-3"
            severity="success"
            @click="submitAttendance"
          />
        </div>

        <!-- Attendance History Card -->
        <Card class="shadow-lg">
          <template #header>
            <div class="flex items-center gap-2 p-4 pb-0">
              <i class="pi pi-history text-xl text-purple-600"></i>
              <h3 class="text-xl font-semibold text-gray-800">Davomat Tarixi</h3>
            </div>
          </template>
          <template #content>
            <div v-if="attendanceHistory.length === 0" class="text-center py-8">
              <i class="pi pi-info-circle text-4xl text-gray-400 mb-4"></i>
              <p class="text-gray-600 italic">Davomat tarixi mavjud emas.</p>
            </div>
            
            <DataTable 
              v-else
              :value="attendanceHistory" 
              class="p-datatable-sm"
              :paginator="attendanceHistory.length > 10"
              :rows="10"
              stripedRows
              responsiveLayout="scroll"
            >
              <Column field="date" header="Sana" sortable>
                <template #body="slotProps">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-calendar text-blue-600"></i>
                    <span class="font-medium">{{ formatDate(slotProps.data.date) }}</span>
                  </div>
                </template>
              </Column>
              
              <Column field="studentId" header="O'quvchi">
                <template #body="slotProps">
                  <div class="flex items-center gap-3">
                    <Avatar 
                      :label="slotProps.data.studentId.name.charAt(0) + slotProps.data.studentId.lastname.charAt(0)"
                      class="bg-gray-100 text-gray-800"
                      size="small"
                    />
                    <span>{{ slotProps.data.studentId.name }} {{ slotProps.data.studentId.lastname }}</span>
                  </div>
                </template>
              </Column>
              
              <Column field="status" header="Holat" class="text-center">
                <template #body="slotProps">
                  <Tag 
                    :value="getStatusText(slotProps.data.status)"
                    :severity="getStatusSeverity(slotProps.data.status)"
                    :icon="getStatusIcon(slotProps.data.status)"
                  />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>

    <!-- Success Toast -->
    <Toast style="width: 300px;"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast';

// PrimeVue Components
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Calendar from 'primevue/calendar';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';

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

// Status helpers (icon, text, severity)
const getStatusIcon = (status) => {
  switch (status) {
    case 'present': return 'pi pi-check-circle';
    case 'absent': return 'pi pi-times-circle';
    case 'late': return 'pi pi-clock';
    default: return 'pi pi-question-circle';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'present': return 'Bor';
    case 'absent': return "Yo'q";
    case 'late': return 'Kechikdi';
    default: return status;
  }
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'present': return 'success';
    case 'absent': return 'danger';
    case 'late': return 'warning';
    default: return 'info';
  }
};

const fetchGroup = async () => {
  loading.value = true;
  error.value = "";
  try {
    const token = sessionStorage.getItem("teacherToken");
    const res = await axios.get(`/attendance/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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
    const token = sessionStorage.getItem("teacherToken");
    const res = await axios.get(`/attendance/history/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    attendanceHistory.value = res.data;
  } catch (e) {
    error.value = e.response?.data?.message || "Davomat tarixini olishda xatolik yuz berdi";
  }
};

const submitAttendance = async () => {
  submitLoading.value = true;
  error.value = "";

  const formattedDate = attendanceDate.value instanceof Date
    ? attendanceDate.value.toISOString()
    : null;

  if (!formattedDate) {
    error.value = "Iltimos, sanani tanlang";
    submitLoading.value = false;
    return;
  }

  try {
    const token = sessionStorage.getItem("teacherToken");
    const recordsPayload = group.value.students.map((student) => ({
      studentId: student._id,
      status: attendanceRecords.value[student._id] || "present",
    }));

    await axios.post(
      "/attendance/mark",
      {
        date: formattedDate,
        records: recordsPayload,
        groupId: groupId
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.add({
      severity: 'success',
      summary: 'Muvaffaqiyat',
      detail: 'Davomat muvaffaqiyatli saqlandi!',
      life:3000
    });

    fetchAttendanceHistory();
  } catch (e) {
    const errorMessage = e.response?.data?.message || "Saqlashda xatolik yuz berdi";
    error.value = errorMessage;
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: errorMessage,
      life: 5000
    });
  } finally {
    submitLoading.value = false;
  }
};

const formatDate = (d) => {
  return new Date(d).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(() => {
  fetchGroup();
  fetchAttendanceHistory();
});
</script>

<style scoped>
:deep(.p-card) {
  padding: 0;
}

/* For mobile-friendly spacing and sizing */
@media (max-width: 640px) {
  .min-w-64 {
    min-width: auto !important;
  }
}
</style>
