<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Loading state -->
    <div v-if="pending" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">Failed to load product information. Please try again later.</p>
    </div>

    <!-- Product details -->
    <div v-else class="grid md:grid-cols-2 gap-8">
      <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <img
          v-if="productImage"
          :src="productImage"
          :alt="productTitle"
          class="max-w-full h-auto object-contain"
        />
      </div>

      <div class="flex flex-col">
        <h1 class="text-3xl font-bold text-gray-900">{{ productTitle }}</h1>
        <div class="mt-4">
          <p class="text-2xl font-semibold text-gray-900">${{ productPrice }}</p>
        </div>
        <div class="mt-4">
          <p class="text-gray-600">{{ productDescription }}</p>
        </div>

        <!-- Quantity selector -->
        <div class="mt-8">
          <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
          <div class="mt-2 flex items-center gap-3">
            <button 
              type="button"
              class="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
              :disabled="quantity <= 1"
              @click="quantity--"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
              </svg>
            </button>
            <input
              type="number"
              id="quantity"
              v-model.number="quantity"
              min="1"
              class="block w-20 rounded-md border-gray-300 text-center shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
            <button 
              type="button"
              class="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
              @click="quantity++"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Total price -->
        <div class="mt-4">
          <p class="text-sm text-gray-600">Total: <span class="font-semibold text-gray-900">${{ (productPrice * quantity).toFixed(2) }}</span></p>
        </div>

        <div class="mt-8">
          <button
            class="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
            @click="handleBuyNow"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>

    <!-- Checkout Panel -->
    <CheckoutPanel
      v-if="product"
      :is-open="isCheckoutOpen"
      :product="product"
      :quantity="quantity"
      @close="isCheckoutOpen = false"
      @proceed-to-payment="handleProceedToPayment"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const config = useRuntimeConfig();
const isCheckoutOpen = ref(false);
const quantity = ref(1);

const { data: productData, error, pending } = await useFetch('/api/products', {
  baseURL: config.public.strapiUrl,
  params: {
    'populate': '*',
    'pagination[pageSize]': 1
  },
  headers: {
    'Authorization': `Bearer ${config.public.strapiToken}`
  }
});

const product = computed(() => {
  if (error.value || !productData.value?.data?.[0]) {
    return null;
  }
  return productData.value.data[0];
});

const productTitle = computed(() => product.value?.title);
const productDescription = computed(() => product.value?.description);
const productPrice = computed(() => product.value?.price);
const productImage = computed(() => {
  const firstImage = product.value?.image?.[0];
  // On utilise le format large pour la page produit
  const imageUrl = firstImage?.formats?.large?.url || firstImage?.url;
  
  if (imageUrl?.startsWith('/')) {
    return `${config.public.strapiUrl}${imageUrl}`;
  }
  
  return imageUrl;
});

const handleBuyNow = () => {
  isCheckoutOpen.value = true;
};

const handleProceedToPayment = async (data) => {
  console.log('Proceeding to payment with:', {
    ...data,
    quantity: quantity.value,
    totalPrice: (productPrice.value * quantity.value).toFixed(2)
  });
  // TODO: Implement Stripe checkout
};
</script> 