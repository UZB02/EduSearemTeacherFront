<template>
  <nav class="bg-gray-500 sticky top-0 z-50">
    <div class="container   px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo Section -->
        <div class="flex items-center space-x-3">
          <div class="bg-white/10 p-2 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <div class="text-white">
            <h1 class="text-xl font-bold tracking-tight">MDEDU</h1>
            <p class="text-gray-100 text-xs">Ta'lim boshqaruv tizimi</p>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-6">
          <!-- Home Link -->
          <router-link 
            to="/" 
            class="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-white/10"
          >
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span>Bosh sahifa</span>
            </div>
          </router-link>

          <!-- User Section -->
          <div class="flex items-center space-x-4">
            <!-- If teacher is logged in -->
            <template v-if="teacher">
              <div class="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-lg">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div class="text-white">
                  <p class="text-sm font-medium">{{ teacher.name }} {{ teacher.lastname }}</p>
                  <p class="text-xs text-gray-100">O'qituvchi</p>
                </div>
              </div>
              
              <button
                @click="logout"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Chiqish</span>
              </button>
            </template>

            <!-- If not logged in -->
            <template v-else>
              <router-link
                to="/login"
                class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg hover:scale-105"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                <span>Kirish</span>
              </router-link>
            </template>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-100 hover:text-white p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-gray-700 border-t border-gray-500">
      <div class="px-4 py-3 space-y-3">
        <!-- Home Link Mobile -->
        <router-link 
          to="/" 
          @click="mobileMenuOpen = false"
          class="block text-gray-100 hover:text-white px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors duration-200"
        >
          Bosh sahifa
        </router-link>

        <!-- User Section Mobile -->
        <div class="border-t border-gray-500 pt-3 ">
          <template v-if="teacher">
            <div class="flex items-center space-x-3 px-3 py-2 mb-3">
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div class="text-white">
                <p class="font-medium">{{ teacher.name }} {{ teacher.lastname }}</p>
                <p class="text-sm text-gray-100">O'qituvchi</p>
              </div>
            </div>
            
            <button
              @click="logout"
              class="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Chiqish</span>
            </button>
          </template>

          <template v-else>
            <router-link
              to="/teacher-login"
              @click="mobileMenuOpen = false"
              class="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              <span>Kirish</span>
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const teacher = ref(null);
const mobileMenuOpen = ref(false);

onMounted(() => {
  const savedTeacher = sessionStorage.getItem("teacherData");
  if (savedTeacher) {
    teacher.value = JSON.parse(savedTeacher);
  }
});

function logout() {
  sessionStorage.removeItem("teacherData");
  sessionStorage.removeItem("teacherToken");
  teacher.value = null;
  mobileMenuOpen.value = false;
  router.push("/login");
}
</script>