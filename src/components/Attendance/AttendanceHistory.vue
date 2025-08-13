<template>
  <Card class="shadow-lg">
    <template #header>
      <div class="flex items-center gap-2 p-4 pb-0">
        <i class="pi pi-history text-xl text-purple-600"></i>
        <h3 class="text-xl font-semibold text-gray-800">Davomat Tarixi</h3>
      </div>
    </template>
    <template #content>
      <div v-if="history.length === 0" class="text-center py-8">
        <i class="pi pi-info-circle text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-600 italic">Davomat tarixi mavjud emas.</p>
      </div>
      <DataTable 
        v-else
        :value="history" 
        class="p-datatable-sm"
        :paginator="history.length > 10"
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
</template>

<script setup>
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';

defineProps({
  history: Array
});

const formatDate = (d) => {
  return new Date(d).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

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
</script>
