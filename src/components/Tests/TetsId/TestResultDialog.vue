<template>
  <Dialog header="Test natijasi" :visible="visible" modal @hide="$emit('update:visible', false)">
    <div class="text-center">
      <p class="text-lg font-semibold">Sizning ballingiz: {{ score }}</p>
      <Button label="Yopish" class="mt-4" @click="$emit('update:visible', false)" />
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from "primevue/dialog";
import Button from "primevue/button";

const props = defineProps({
  visible: Boolean,
  score: Number
});
</script>
