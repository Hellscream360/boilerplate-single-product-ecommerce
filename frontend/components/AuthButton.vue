<template>
  <div>
    <button
      v-if="!user"
      @click="authStore.showLoginModal()"
      class="text-gray-500 hover:text-gray-700"
    >
      {{ $t('auth.signIn') }}
    </button>
    
    <div v-else class="relative">
      <button
        ref="buttonRef"
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
        ref="menuRef"
        class="absolute right-0 mt-2 w-48 rounded-lg bg-white py-2 shadow-xl border border-gray-100 z-50 transform transition-all duration-200 ease-out"
      >
        <div class="px-4 py-2 border-b border-gray-50">
          <p class="text-sm text-gray-500">{{ $t('auth.loggedInAs') }}</p>
          <p class="text-sm font-medium text-gray-900 truncate">{{ user.email }}</p>
        </div>
        
        <a
          href="#"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
          @click.prevent="handleLogout"
        >
          {{ $t('auth.logout') }}
        </a>
      </div>
    </div>

    <AuthModal
      :is-open="authStore.showAuthModal"
      @close="authStore.hideLoginModal()"
      @success="handleAuthSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const user = ref(null);
const isMenuOpen = ref(false);
const menuRef = ref(null);
const buttonRef = ref(null);

onMounted(async () => {
  try {
    const token = import.meta.client ? localStorage.getItem('token') : null;
    
    if (token) {
      // Fetch user from Strapi
      const response = await fetch(`${useRuntimeConfig().public.strapiUrl}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        user.value = await response.json();
      }
    }

    // Add click event listener to close menu when clicking outside
    if (import.meta.client) {
      document.addEventListener('click', handleClickOutside);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener('click', handleClickOutside);
  }
});

const handleClickOutside = (event) => {
  // Si on clique sur le bouton du menu, on ne fait rien (laisse le toggle gérer)
  if (buttonRef.value && buttonRef.value.contains(event.target)) {
    return;
  }
  
  // Si on clique en dehors du menu, on le ferme
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    isMenuOpen.value = false;
  }
};

const handleAuthSuccess = async (data) => {
  // Store the JWT token only on client side
  if (import.meta.client) {
    localStorage.setItem('token', data.jwt);
  }
  
  // Fetch complete user data with role
  try {
    const response = await fetch(`${useRuntimeConfig().public.strapiUrl}/api/users/me?populate=role`, {
      headers: {
        Authorization: `Bearer ${data.jwt}`
      }
    });
    
    if (response.ok) {
      user.value = await response.json();
      
      // If user is admin and there's a redirect path, navigate to it
      if (user.value?.isAdmin && authStore.redirectPath) {
        navigateTo(authStore.redirectPath);
      }
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
  
  authStore.hideLoginModal();
};

const handleLogout = () => {
  if (import.meta.client) {
    localStorage.removeItem('token');
  }
  user.value = null;
  isMenuOpen.value = false;
};
</script> 