<template>
  <footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-500">
          {{ t('footer.copyright', { year: new Date().getFullYear() }) }}
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative inline-block text-left">
            <select
              :value="currentLocale"
              @change="switchLanguage"
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
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

// Compute current locale based on route
const currentLocale = computed(() => {
  return route.fullPath.startsWith('/fr') ? 'fr' : 'en';
});

const switchLanguage = async (event) => {
  const newLocale = event.target.value;
  const currentPath = route.fullPath.replace(/^\/fr/, '');
  const newPath = newLocale === 'fr' ? `/fr${currentPath}` : currentPath;
  
  // Navigate and update locale
  await navigateTo(newPath, { 
    locale: newLocale,
    redirectCode: 301
  });
};
</script>

<style scoped>
/* Hide native select arrow on WebKit/Blink */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style> 