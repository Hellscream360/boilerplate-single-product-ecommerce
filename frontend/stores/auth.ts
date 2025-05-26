import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    showAuthModal: false,
    redirectPath: null as string | null,
  }),

  actions: {
    showLoginModal(redirect: string | null = null) {
      this.showAuthModal = true;
      this.redirectPath = redirect;
    },
    hideLoginModal() {
      this.showAuthModal = false;
      this.redirectPath = null;
    },
  },
}); 