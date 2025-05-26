import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to) => {
  const { $strapi } = useNuxtApp();
  const user = await $strapi.getUser();
  const authStore = useAuthStore();

  if (!user || !user.isAdmin) {
    // Show login modal instead of redirecting to login page
    authStore.showLoginModal(to.fullPath);
    // Redirect to home page if not on home already
    if (to.fullPath !== '/') {
      return navigateTo('/');
    }
  }
}); 