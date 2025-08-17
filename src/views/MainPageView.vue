<template>
  <div class="container">
    <HeaderSection />

    <LoadingState v-if="loading" />
    <ErrorMessage v-if="error" :message="error" />
    <EmptyState v-if="groups.length === 0 && !loading && !error" />

    <GroupList v-if="groups.length > 0" :groups="groups" />
    <GroupStats v-if="groups.length > 0" :groups="groups" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../utils/api.js";
import HeaderSection from "../components/Group/HeaderSection.vue";
import LoadingState from "../components/Group/LoadingState.vue";
import ErrorMessage from "../components/Group/ErrorMessage.vue";
import EmptyState from "../components/Group/EmptyState.vue";
import GroupList from "../components/Group/GroupList.vue";
import GroupStats from "../components/Group/GroupStats.vue";

const groups = ref([]);
const loading = ref(false);
const error = ref("");

const fetchGroups = async () => {
  loading.value = true;
  error.value = "";
  try {
    const token = sessionStorage.getItem("teacherToken");
    const res = await api.get("/attendance/my-students", {
      headers: { Authorization: `Bearer ${token}` },
    });
    groups.value = res.data;
  } catch (e) {
    error.value = e.response?.data?.message || "Ma'lumotlarni olishda xatolik yuz berdi";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchGroups();
});
</script>
