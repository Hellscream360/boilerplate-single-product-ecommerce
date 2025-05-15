<template>
  <div>
    <button
      v-if="!user"
      @click="showAuthModal = true"
      class="text-gray-500 hover:text-gray-700"
    >
      Sign in
    </button>
    
    <div v-else class="relative">
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="flex items-center text-gray-500 hover:text-gray-700 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors duration-200"
      >
        <span class="mr-2 text-sm font-medium">{{ user.username || user.email }}</span>
        <svg
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <div
        v-if="isMenuOpen"
        class="absolute right-0 mt-2 w-48 rounded-lg bg-white py-2 shadow-xl border border-gray-100 z-50 transform transition-all duration-200 ease-out"
      >
        <div class="px-4 py-2 border-b border-gray-50">
          <p class="text-sm text-gray-500">Connecté en tant que</p>
          <p class="text-sm font-medium text-gray-900 truncate">{{ user.email }}</p>
        </div>
        <a
          href="#"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
          @click.prevent="handleLogout"
        >
          Se déconnecter
        </a>
      </div>
    </div>

    <AuthModal
      :is-open="showAuthModal"
      @close="showAuthModal = false"
      @success="handleAuthSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const user = ref(null);
const showAuthModal = ref(false);
const isMenuOpen = ref(false);

onMounted(() => {
  // Check if user is already logged in
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
});

const handleAuthSuccess = (data) => {
  user.value = data.user;
  showAuthModal.value = false;
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  user.value = null;
  isMenuOpen.value = false;
};
</script> 