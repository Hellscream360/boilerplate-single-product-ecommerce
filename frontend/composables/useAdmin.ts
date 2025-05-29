import { ref, computed } from 'vue';

export const useAdmin = () => {
  const { $strapi } = useNuxtApp();
  const user = ref($strapi.user);
  const isAdmin = computed(() => user.value?.isAdmin ?? false);

  const checkAuth = async () => {
    try {
      const currentUser = await $strapi.getUser();
      user.value = currentUser;
      return isAdmin.value;
    } catch (error) {
      console.error('Error checking auth:', error);
      return false;
    }
  };

  return {
    user,
    isAdmin,
    checkAuth
  };
}; 