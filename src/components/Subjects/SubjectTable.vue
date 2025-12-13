<template>
  <DataTable
    :value="subjects"
    paginator
    :rows="10"
    sortField="name"
    :sortOrder="1"
    responsiveLayout="stack"
    breakpoint="768px"
    class="text-sm"
  >
    <!-- Fan nomi -->
    <Column field="name" header="Fan">
      <template #body="{ data }">
        <span class="font-medium">
          {{ data.name }}
        </span>
      </template>
    </Column>

    <!-- Kod (mobil da yashirin) -->
    <Column
      field="code"
      header="Kod"
      sortable
      class="hidden md:table-cell"
    />

    <!-- Tavsif (faqat desktop) -->
    <Column
      field="description"
      header="Tavsif"
      class="hidden lg:table-cell"
    />

    <!-- Amallar -->
    <Column header="Amallar">
      <template #body="{ data }">
        <div
          class="flex gap-2
                 justify-end md:justify-start"
        >
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-text p-button-warning"
            @click="$emit('edit-subject', data)"
          />

          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-text p-button-danger"
            @click="$emit('delete-subject', data)"
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

defineProps({
  subjects: Array,
});

defineEmits(["edit-subject", "delete-subject"]);
</script>
