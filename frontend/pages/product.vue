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

        <!-- Availability status -->
        <div class="mt-4">
          <div v-if="productAvailable" class="flex items-center text-green-600">
            <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-sm font-medium">In Stock</span>
          </div>
          <div v-else class="flex items-center text-red-600">
            <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span class="text-sm font-medium">Out of Stock</span>
          </div>
        </div>

        <!-- Quantity selector -->
        <div class="mt-8">
          <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
          <div class="mt-1.5 flex items-center gap-3">
            <button 
              type="button"
              class="rounded-lg bg-gray-100 p-3 text-gray-600 shadow-sm transition duration-150 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
              class="block w-20 rounded-lg border-gray-200 bg-white px-4 py-3 text-center text-gray-700 shadow-sm transition duration-150 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0"
            >
            <button 
              type="button"
              class="rounded-lg bg-gray-100 p-3 text-gray-600 shadow-sm transition duration-150 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
            class="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg transition-colors"
            :class="productAvailable ? 'hover:bg-indigo-700' : 'opacity-50 cursor-not-allowed'"
            @click="handleBuyNow"
            :disabled="!productAvailable"
          >
            {{ productAvailable ? 'Buy Now' : 'Out of Stock' }}
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
const productAvailable = computed(() => product.value?.available);
const productImage = computed(() => {
  const firstImage = product.value?.image?.[0];
  // Using large format for product page
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