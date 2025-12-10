<template>
  <div class="mb-4 border p-4 rounded shadow-sm">
    <div class="flex justify-between items-start mb-2">
      <div class="font-semibold">
        Savol {{ index + 1 }}: <span v-html="question.question"></span>
      </div>
      <div class="flex gap-2">
        <Button
          icon="pi pi-pencil"
          class="p-button-sm p-button-warning"
          @click="$emit('edit-question', index)"
          v-if="!submitted"
        />
        <Button
          icon="pi pi-trash"
          class="p-button-sm p-button-danger"
          @click="$emit('delete-question', index)"
          v-if="!submitted"
        />
      </div>
    </div>

    <div v-for="(option, i) in question.options" :key="i" class="flex items-center mb-1">
      <input
        type="radio"
        :name="'question-' + index"
        :value="option"
        :checked="modelValue === option"
        @change="$emit('update:modelValue', option)"
        class="mr-2"
        :disabled="submitted"
      />
      <label v-html="option"></label>
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";

const props = defineProps({
  question: Object,       // Savol obyekti { question, options, correctAnswer, points }
  index: Number,          // Savol raqami
  modelValue: String,     // V-model orqali tanlangan javob
  submitted: Boolean      // Test yuborilgan yoki yo'qligini bilish uchun
});

const emit = defineEmits(["update:modelValue", "edit-question", "delete-question"]);
</script>

<style scoped>
/* Qo'shimcha styling */
</style>
