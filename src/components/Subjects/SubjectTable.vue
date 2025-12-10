<template>
  <DataTable
    :value="subjects"
    :paginator="true"
    :rows="10"
    sortField="name"
    :sortOrder="1"
    responsiveLayout="scroll"
  >
    <Column field="name" header="Fan Nomi" sortable></Column>
    <Column field="code" header="Kod" sortable></Column>
    <Column field="description" header="Tavsif"></Column>

    <!-- Amallar -->
    <Column header="Amallar">
      <template #body="slotProps">
        <div class="flex gap-2">
          <Button
            icon="pi pi-pencil"
            class="p-button-sm p-button-warning"
            @click="$emit('edit-subject', slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-sm p-button-danger"
            @click="$emit('delete-subject', slotProps.data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";

const props = defineProps({
  subjects: Array
});
const emit = defineEmits(["edit-subject", "delete-subject"]);
</script>
