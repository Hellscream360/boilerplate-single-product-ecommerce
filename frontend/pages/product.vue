<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Loading state -->
    <div v-if="pending" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ $t('error.loadProduct') }}</p>
    </div>

    <!-- Product details -->
    <div v-else-if="product" class="grid md:grid-cols-2 gap-8">
      <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <img
          v-if="formattedImageUrl"
          :src="formattedImageUrl"
          :alt="product.title"
          class="max-w-full h-auto object-contain"
        />
      </div>

      <div class="flex flex-col">
        <h1 class="text-3xl font-bold text-gray-900">{{ product.title }}</h1>
        <div class="mt-4">
          <p class="text-2xl font-semibold text-gray-900">${{ currentPrice }}</p>
        </div>
        <div class="mt-4">
          <p class="text-gray-600">{{ product.description }}</p>
        </div>

        <!-- Availability status -->
        <div class="mt-4">
          <div v-if="isAvailable" class="flex items-center text-green-600">
            <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-sm font-medium">{{ $t('product.inStock') }}</span>
          </div>
          <div v-else class="flex items-center text-red-600">
            <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span class="text-sm font-medium">{{ $t('product.outOfStock') }}</span>
          </div>
        </div>

        <!-- Variant selector -->
        <ProductVariantSelector
          v-if="product && product.variants && product.variants.length > 0"
          :variants="product.variants"
          :initial-variant-id="selectedVariant?.id"
          :product="product"
          :quantity="quantity"
          @select="selectVariant"
        />

        <!-- Quantity selector -->
        <div class="mt-8">
          <label for="quantity" class="block text-sm font-medium text-gray-700">{{ $t('product.quantity') }}</label>
          <div class="mt-1.5 flex items-center gap-3">
            <button 
              type="button"
              class="rounded-lg bg-gray-100 p-3 text-gray-600 shadow-sm transition duration-150 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              :disabled="quantity <= 1"
              @click="decrementQuantity"
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
              @click="incrementQuantity"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Total price -->
        <div class="mt-4">
          <p class="text-sm text-gray-600">{{ $t('product.total') }}: <span class="font-semibold text-gray-900">${{ totalPrice.toFixed(2) }}</span></p>
        </div>

        <div class="mt-8 flex gap-4">
          <button
            class="flex-1 bg-white text-indigo-600 border border-indigo-600 py-3 px-6 rounded-lg transition-colors"
            :class="isAvailable ? 'hover:bg-indigo-50' : 'opacity-50 cursor-not-allowed'"
            @click="handleAddToCart"
            :disabled="!isAvailable"
          >
            {{ isAvailable ? $t('product.addToCart') : $t('product.outOfStock') }}
          </button>
          <button
            class="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg transition-colors"
            :class="isAvailable ? 'hover:bg-indigo-700' : 'opacity-50 cursor-not-allowed'"
            @click="handleBuyNow"
            :disabled="!isAvailable"
          >
            {{ isAvailable ? $t('product.buyNow') : $t('product.outOfStock') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Cart Panel -->
    <CartPanel
      :is-open="isCartOpen"
      @close="isCartOpen = false"
      @checkout="handleCheckout"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { Product, ProductResponse } from '~/types/product';
import { useProduct } from '~/composables/useProduct';
import { useCart } from '~/composables/useCart';

const config = useRuntimeConfig();
const { locale } = useI18n();
const router = useRouter();
const isCartOpen = ref(false);
const cart = useCart();

// Log de la configuration
console.log('API Configuration:', {
  strapiUrl: config.public.strapiUrl,
  hasToken: !!config.public.strapiToken,
  locale: locale.value
});

const { data: productData, error, pending } = await useFetch<ProductResponse>('/api/products', {
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

console.log('Réponse brute Strapi :', JSON.stringify(productData.value, null, 2));

// Log de l'erreur si elle existe
if (error.value) {
  console.error('API Error:', error.value);
}

// Log de la réponse
console.log('API Response:', productData.value);

const product = computed(() => {
  if (error.value) {
    console.error('Error loading product:', error.value);
    return null;
  }
  
  if (!productData.value?.data?.[0]) {
    console.log('No product data found');
    return null;
  }

  const currentProduct = productData.value.data[0];
  console.log('Product data structure:', {
    id: currentProduct.id,
    title: currentProduct.title,
    hasVariants: !!currentProduct.variants,
    variantsCount: currentProduct.variants?.length,
    variants: currentProduct.variants,
    relations: Object.keys(currentProduct)
  });
  return currentProduct;
});

// Watch pour le débogage des variantes
watch(product, (newProduct) => {
  if (newProduct) {
    console.log('Product variants debug:', {
      hasVariants: !!newProduct.variants,
      variantsCount: newProduct.variants?.length,
      variants: newProduct.variants,
      fullProduct: newProduct
    });
  }
}, { immediate: true });

const {
  selectedVariant,
  quantity,
  currentPrice,
  isAvailable,
  formattedImageUrl,
  totalPrice,
  selectVariant,
  incrementQuantity,
  decrementQuantity
} = useProduct(product.value);

// Watch for locale changes and update the URL
watch(locale, async (newLocale) => {
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
  router.push(path);
});

// Prepare product data for checkout
const checkoutProduct = computed(() => {
  if (!product.value || !formattedImageUrl.value) return null;

  return {
    id: selectedVariant.value?.id || product.value.id,
    title: `${product.value.title}${selectedVariant.value ? ` - ${selectedVariant.value.name}` : ''}`,
    price: currentPrice.value,
    image: formattedImageUrl.value,
  };
});

const handleBuyNow = () => {
  if (isAvailable.value && product.value) {
    cart.addToCart(product.value, selectedVariant.value, quantity.value);
    isCartOpen.value = true;
    setTimeout(() => {
      const checkoutButton = document.querySelector('[data-checkout-button]') as HTMLButtonElement;
      if (checkoutButton && !checkoutButton.disabled) {
        checkoutButton.click();
      }
    }, 100);
  }
};

const handleAddToCart = () => {
  if (isAvailable.value && product.value) {
    cart.addToCart(product.value, selectedVariant.value, quantity.value);
    isCartOpen.value = true;
  }
};

const handleCheckout = () => {
  isCartOpen.value = false;
  // You might want to redirect to a checkout page or show a checkout form
};
</script> 