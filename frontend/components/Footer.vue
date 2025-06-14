<template>
  <footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-500">
          {{ t('footer.copyright', { year: new Date().getFullYear() }) }}
        </div>
        <div class="flex items-center space-x-4">
          <!-- Language selector -->
          <div class="relative inline-block text-left">
            <select
              v-model="selectedLocale"
              class="appearance-none block pl-4 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="en">🇬🇧 English</option>
              <option value="fr">🇫🇷 Français</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const { t, locale: i18nLocale } = useI18n();
const route = useRoute();

// Use v-model with a computed property that handles reading and writing
const selectedLocale = computed({
  get() {
    return route.fullPath.startsWith('/fr') ? 'fr' : 'en';
  },
  async set(newLocale) {
    const currentPath = route.fullPath.replace(/^\/fr/, '');
    const newPath = newLocale === 'fr' ? `/fr${currentPath}` : currentPath;
    
    // Navigate to the new URL and wait for completion
    await navigateTo(newPath);
    
    // Update the locale after navigation is complete
    i18nLocale.value = newLocale;
  }
});

// Initialize language on mount
onMounted(() => {
  if (route.fullPath.startsWith('/fr')) {
    i18nLocale.value = 'fr';
  }
});
</script>

<style scoped>
/* Hide native select arrow on WebKit/Blink */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>