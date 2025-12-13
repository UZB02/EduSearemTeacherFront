<template>
  <Card class="shadow-xl border-0 rounded-xl overflow-hidden">
    <!-- Header -->
    <template #header>
      <div class="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 border-b border-purple-100">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Title -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
              <i class="pi pi-history text-white text-lg"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800 m-0">Davomat Tarixi</h3>
              <p class="text-sm text-gray-500 m-0 mt-1">{{ totalRecords }} ta dars</p>
            </div>
          </div>

          <!-- Search + Filter Button -->
          <div class="flex items-center justify-between gap-2">
            <span class="flex items-center flex-1 max-w-xs">
              <InputText
                v-model="filters.global.value"
                placeholder="Qidirish..."
                class="p-inputtext-sm w-full"
              />
            </span>
            <Button
              icon="pi pi-filter"
              @click="toggleFilters"
              :class="{ 'p-button-outlined': !showFilters, 'p-button-info': showFilters }"
              class="p-button-rounded"
              v-tooltip.bottom="'Filtrlash'"
            />
          </div>
        </div>

        <!-- Advanced Filters -->
        <div
          v-if="showFilters"
          class="mt-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100 animate-fadeIn"
        >
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Date Range -->
            <div>
              <label class="text-sm font-medium text-gray-700 mb-1 block">Sana oralig'i</label>
              <Calendar
                v-model="dateRange"
                selectionMode="range"
                :manualInput="false"
                dateFormat="yy-mm-dd"
                placeholder="Sana tanlang"
                class="w-full"
                showIcon
              />
            </div>
            <!-- Status -->
            <div>
              <label class="text-sm font-medium text-gray-700 mb-1 block">Holat</label>
              <MultiSelect
                v-model="selectedStatuses"
                :options="statusOptions"
                optionLabel="name"
                placeholder="Barcha holatlar"
                class="w-full"
              />
            </div>
            <!-- Apply -->
            <div class="flex items-end">
              <Button
                label="Filtrlash"
                icon="pi pi-filter"
                class="w-full bg-purple-600 border-purple-600 hover:bg-purple-700"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Content -->
    <template #content>
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" class="text-purple-500" />
      </div>

      <!-- Empty State -->
      <div v-else-if="history.length === 0" class="py-12 px-6 text-center">
        <div class="flex flex-col items-center">
          <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <i class="pi pi-calendar-times text-purple-500 text-3xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Davomat tarixi mavjud emas</h3>
          <p class="text-gray-600 max-w-md mb-6">
            Hozircha bu guruh uchun davomat ma'lumotlari kiritilmagan yoki tanlangan filtrlarga mos
            ma'lumotlar topilmadi.
          </p>
        </div>
      </div>

      <!-- Data Table -->
      <div v-else>
        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div
            v-for="(stat, index) in attendanceStats"
            :key="index"
            class="bg-gradient-to-br rounded-xl p-4 shadow-sm border flex items-center gap-4"
            :class="stat.bgClass"
          >
            <div class="w-12 h-12 rounded-lg flex items-center justify-center" :class="stat.iconBg">
              <i :class="['pi text-xl', stat.icon, stat.iconColor]"></i>
            </div>
            <div>
              <p class="text-sm font-medium m-0" :class="stat.textColor">{{ stat.label }}</p>
              <p class="text-2xl font-bold m-0" :class="stat.valueColor">{{ stat.value }}</p>
            </div>
          </div>
        </div>

        <!-- Table -->
        <DataTable
          :value="filteredHistory"
          v-model:filters="filters"
          :paginator="filteredHistory.length > 10"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 25, 50]"
          :globalFilterFields="['studentId.name', 'studentId.lastname', 'date', 'status']"
          stripedRows
          removableSort
          scrollable
          scrollHeight="500px"
          dataKey="id"
          rowHover
          responsiveLayout="scroll"
        >
          <template #empty>
            <p class="text-gray-500 p-4">Mos keladigan ma'lumotlar topilmadi</p>
          </template>

          <template #header>
            <div class="flex justify-between items-center">
              <h4 class="m-0 text-lg font-semibold text-gray-700">Davomat ro'yxati</h4>
              <Button icon="pi pi-refresh" class="p-button-text p-button-rounded" @click="$emit('refresh')" />
            </div>
          </template>

          <!-- Date -->
          <Column field="date" header="Sana" sortable style="min-width: 200px">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <i class="pi pi-calendar text-blue-600 text-sm"></i>
                </div>
                <div>
                  <p class="font-medium text-gray-800 m-0">{{ formatDate(data.date) }}</p>
                  <p class="text-xs text-gray-500 m-0">{{ formatTime(data.date) }}</p>
                </div>
              </div>
            </template>
          </Column>

          <!-- Student -->
          <Column field="studentId" header="O'quvchi" sortable style="min-width: 250px">
            <template #body="{ data }">
              <div class="flex items-center gap-3">
                <Avatar
                  :label="getInitials(data.studentId)"
                  shape="circle"
                  size="small"
                  :style="{ backgroundColor: getAvatarColor(data.studentId.name) }"
                  class="shadow-sm"
                />
                <div>
                  <p class="font-medium text-gray-800 m-0">
                    {{ data.studentId.name }} {{ data.studentId.lastname }}
                  </p>
                  <p v-if="data.studentId.phone" class="text-xs text-gray-500 m-0">
                    <i class="pi pi-phone mr-1"></i> {{ data.studentId.phone }}
                  </p>
                </div>
              </div>
            </template>
          </Column>

          <!-- Status -->
          <Column field="status" header="Holat" sortable style="min-width: 150px">
            <template #body="{ data }">
              <Tag
                :value="getStatusText(data.status)"
                :severity="getStatusSeverity(data.status)"
                :icon="getStatusIcon(data.status)"
                class="px-3 py-2"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import MultiSelect from 'primevue/multiselect'
import ProgressSpinner from 'primevue/progressspinner'
import { FilterMatchMode } from '@primevue/core/api'

const props = defineProps({
  history: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['refresh', 'add-attendance'])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})
const showFilters = ref(false)
const dateRange = ref(null)
const selectedStatuses = ref([])

const statusOptions = [
  { name: 'Bor', value: 'present' },
  { name: "Yo'q", value: 'absent' },
  { name: 'Kechikdi', value: 'late' }
]

// Unikal sana soni
const totalRecords = computed(() => {
  const uniqueDates = new Set(props.history.map(r => new Date(r.date).toDateString()))
  return uniqueDates.size
})

// Filterlangan ro‘yxat
const filteredHistory = computed(() => {
  return props.history.filter(r => {
    let dateMatch = true
    if (dateRange.value?.[0]) {
      const start = new Date(dateRange.value[0])
      const end = dateRange.value[1] ? new Date(dateRange.value[1]) : start
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      const recDate = new Date(r.date)
      dateMatch = recDate >= start && recDate <= end
    }
    let statusMatch = !selectedStatuses.value.length ||
      selectedStatuses.value.some(s => s.value === r.status)
    return dateMatch && statusMatch
  })
})
// Statistikalar
const attendanceStats = computed(() => {
  const today = new Date().toLocaleDateString('uz-UZ')
  const todayHistory = props.history.filter(r =>
    new Date(r.date).toLocaleDateString('uz-UZ') === today
  )
  const total = todayHistory.length
  const present = todayHistory.filter(r => r.status === 'present').length
  const absent = todayHistory.filter(r => r.status === 'absent').length
  const late = todayHistory.filter(r => r.status === 'late').length
  const presentPercent = total ? Math.round((present / total) * 100) : 0

  return [
    { label: 'Davomat foizi', value: `${presentPercent}%`, icon: 'pi-chart-pie', iconColor: 'text-purple-600', iconBg: 'bg-purple-100', textColor: 'text-purple-800', valueColor: 'text-purple-600', bgClass: 'from-purple-50 to-purple-100 border-purple-200' },
    { label: 'Bor', value: present, icon: 'pi-check-circle', iconColor: 'text-green-600', iconBg: 'bg-green-100', textColor: 'text-green-800', valueColor: 'text-green-600', bgClass: 'from-green-50 to-green-100 border-green-200' },
    { label: "Yo'q / Kechikkan", value: `${absent} / ${late}`, icon: 'pi-times-circle', iconColor: 'text-red-600', iconBg: 'bg-red-100', textColor: 'text-red-800', valueColor: 'text-red-600', bgClass: 'from-red-50 to-red-100 border-red-200' }
  ]
})

// Funksiyalar
const formatDate = d => new Date(d).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })
const formatTime = d => new Date(d).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
const getStatusIcon = s => s === 'present' ? 'pi pi-check-circle' : s === 'absent' ? 'pi pi-times-circle' : s === 'late' ? 'pi pi-clock' : 'pi pi-question-circle'
const getStatusText = s => s === 'present' ? 'Bor' : s === 'absent' ? "Yo'q" : s === 'late' ? 'Kechikdi' : s
const getStatusSeverity = s => s === 'present' ? 'success' : s === 'absent' ? 'danger' : s === 'late' ? 'warn' : 'info'
const getInitials = student => (student?.name?.[0] || '') + (student?.lastname?.[0] || '')
const getAvatarColor = name => ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4'][name ? name.charCodeAt(0) % 7 : 0]
const toggleFilters = () => showFilters.value = !showFilters.value
</script>
