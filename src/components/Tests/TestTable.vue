<template>
  <DataTable
    :value="tests"
    :paginator="true"
    :rows="10"
    sortField="createdAt"
    :sortOrder="-1"
    responsiveLayout="scroll"
  >
    <!-- Test nomi ustiga bosilganda route -->
    <Column
      field="title"
      header="Test Nomi"
      sortable
    >
      <template #body="slotProps">
        <span
          class="text-blue-600 hover:underline cursor-pointer"
          @click="goToTest(slotProps.data._id)"
        >
          {{ slotProps.data.title }}
        </span>
      </template>
    </Column>

    <Column field="subjectId.name" header="Fan Nomi"></Column>
    <Column field="description" header="Tavsif"></Column>

    <Column header="Amallar">
      <template #body="slotProps">
        <div class="flex gap-2">
          <Button
            v-if="isOwner(slotProps.data)"
            icon="pi pi-pencil"
            class="p-button-sm p-button-warning"
            @click="$emit('edit-test', slotProps.data)"
          />
          <Button
            v-if="isOwner(slotProps.data)"
            icon="pi pi-trash"
            class="p-button-sm p-button-danger"
            @click="$emit('delete-test', slotProps.data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { useRouter } from "vue-router";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";

const props = defineProps({
  tests: Array,
  userId: String
});
const emit = defineEmits(["edit-test", "delete-test"]);

const router = useRouter();

// Sahifa egasi tekshiruvi
const isOwner = (test) => test.teacherId === props.userId;

// Test nomiga bosilganda
const goToTest = (id) => {
  router.push(`/tests/${id}`);
};
</script>
