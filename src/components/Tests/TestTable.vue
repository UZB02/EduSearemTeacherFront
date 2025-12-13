<template>
  <DataTable
    :value="tests"
    paginator
    :rows="10"
    sortField="createdAt"
    :sortOrder="-1"
    responsiveLayout="stack"
    breakpoint="768px"
    class="text-sm"
  >
    <!-- Test nomi -->
    <Column field="title" header="Test">
      <template #body="{ data }">
        <span
          class="text-blue-600 hover:underline cursor-pointer font-medium"
          @click="goToTest(data._id)"
        >
          {{ data.title }}
        </span>
      </template>
    </Column>

    <!-- Fan nomi (mobil da yashirinadi) -->
    <Column
      field="subjectId.name"
      header="Fan"
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
        <div class="flex gap-2 justify-end md:justify-start">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-text p-button-warning"
            @click="$emit('edit-test', data)"
          />

          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-text p-button-danger"
            @click="$emit('delete-test', data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

defineProps({
  tests: Array,
  userId: String
})

defineEmits(['edit-test', 'delete-test'])

const router = useRouter()

const goToTest = (id) => {
  router.push(`/tests/${id}`)
}
</script>
