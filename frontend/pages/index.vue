<template>
  <div class="space-y-24">
    <!-- Loading state -->
    <div v-if="pending" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ t('error.loadProduct') }}</p>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Hero Section -->
      <section class="relative overflow-hidden bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="order-2 lg:order-1 space-y-8">
              <h1 class="text-4xl md:text-5xl font-bold text-gray-900">
                {{ productTitle }}
              </h1>
              <p class="text-xl text-gray-600">
                {{ productDescription }}
              </p>
              <div class="flex items-center mb-4">
                <div v-if="productAvailable" class="flex items-center text-green-600">
                  <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-sm font-medium">{{ t('product.inStock') }}</span>
                </div>
                <div v-else class="flex items-center text-red-600">
                  <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span class="text-sm font-medium">{{ t('product.outOfStock') }}</span>
                </div>
              </div>
              <div class="flex gap-4">
                <a href="#discover" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                  {{ t('product.learnMore') }}
                </a>
                <a 
                  :href="productAvailable ? localizedProductUrl : '#'"
                  class="inline-flex items-center px-6 py-3 border text-base font-medium rounded-md shadow-sm transition-colors"
                  :class="productAvailable 
                    ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50' 
                    : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'"
                >
                  {{ productAvailable ? t('product.buyNow') : t('product.outOfStock') }}
                </a>
              </div>
            </div>
            <div class="order-1 lg:order-2 flex items-center justify-center">
              <img
                :src="productImage"
                :alt="productTitle"
                class="max-w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="discover" class="bg-gray-50 py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-gray-900">{{ t('features.title') }}</h2>
            <p class="mt-4 text-xl text-gray-600">{{ t('features.subtitle') }}</p>
          </div>
          
          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900">{{ t('features.performance.title') }}</h3>
              <p class="mt-2 text-gray-600">{{ t('features.performance.description') }}</p>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm">
              <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900">{{ t('features.security.title') }}</h3>
              <p class="mt-2 text-gray-600">{{ t('features.security.description') }}</p>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm">
              <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900">{{ t('features.simplicity.title') }}</h3>
              <p class="mt-2 text-gray-600">{{ t('features.simplicity.description') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="bg-indigo-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-white">{{ t('cta.title') }}</h2>
            <p class="mt-4 text-xl text-indigo-100">
              {{ t('cta.subtitle') }}
            </p>
            <div class="mt-8">
              <a :href="localizedProductUrl" class="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50">
                {{ t('cta.button') }}
              </a>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const { locale, t } = useI18n();
const router = useRouter();

// Initialize i18n
const i18n = useI18n({
  useScope: 'global',
  legacy: false
});

const { data: productData, error, pending } = await useFetch('/api/products', {
  baseURL: config.public.strapiUrl,
  params: {
    'populate': '*',
    'pagination[pageSize]': 1,
    'locale': locale.value
  },
  headers: config.public.strapiToken ? {
    'Authorization': `Bearer ${config.public.strapiToken}`
  } : undefined
});

// Watch for locale changes and update the URL
watch(locale, async (newLocale) => {
  // Refetch product data with new locale
  const { data } = await useFetch('/api/products', {
    baseURL: config.public.strapiUrl,
    params: {
      'populate': '*',
      'pagination[pageSize]': 1,
      'locale': newLocale
    },
    headers: config.public.strapiToken ? {
      'Authorization': `Bearer ${config.public.strapiToken}`
    } : undefined
  });

  const path = newLocale === 'en' ? '/product' : '/fr/product';
});

const product = computed(() => {
  if (error.value || !productData.value?.data?.[0]) {
    return fallbackProduct;
  }
  return productData.value.data[0];
});

const productTitle = computed(() => product.value?.title);
const productDescription = computed(() => product.value?.description);
const productAvailable = computed(() => product.value?.available);
const productSlug = computed(() => product.value?.slug);
const productImage = computed(() => {
  const firstImage = product.value?.image?.[0];
  // Using medium format for better performance
  const imageUrl = firstImage?.formats?.medium?.url || firstImage?.url;
  
  if (imageUrl?.startsWith('/')) {
    return `${config.public.strapiUrl}${imageUrl}`;
  }
  
  return imageUrl;
});

// Compute the localized product URL
const localizedProductUrl = computed(() => {
  if (!productSlug.value) return '#';
  return locale.value === 'en' 
    ? '/product' 
    : '/fr/product';
});
</script>