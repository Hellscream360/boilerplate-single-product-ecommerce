<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-x-full"
    enter-to-class="transform translate-x-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-x-0"
    leave-to-class="transform translate-x-full"
  >
    <div v-if="isOpen" class="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50">
      <div class="h-full flex flex-col">
        <!-- Header -->
        <div class="px-4 py-6 sm:px-6 border-b border-gray-200">
          <div class="flex items-start justify-between">
            <h2 class="text-lg font-medium text-gray-900">{{ $t('cart.title') }}</h2>
            <button
              type="button"
              class="text-gray-400 hover:text-gray-500"
              @click="$emit('close')"
            >
              <span class="sr-only">{{ $t('cart.close') }}</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Cart items -->
        <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div v-if="cart.items.value.length === 0" class="text-center py-12">
            <p class="text-gray-500">{{ $t('cart.empty') }}</p>
          </div>
          <ul v-else class="divide-y divide-gray-200">
            <li v-for="item in cart.items.value" :key="`${item.product.id}-${item.variant?.id || 'default'}`" class="py-6">
              <div class="flex items-center">
                <!-- Product image -->
                <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    :src="getImageUrl(item.product)"
                    :alt="getItemTitle(item)"
                    class="h-full w-full object-cover object-center"
                  />
                </div>

                <!-- Product details -->
                <div class="ml-4 flex flex-1 flex-col">
                  <div>
                    <div class="flex justify-between text-base font-medium text-gray-900">
                      <h3>{{ getItemTitle(item) }}</h3>
                      <p class="ml-4">{{ formatPrice(getItemPrice(item)) }}</p>
                    </div>
                  </div>
                  <div class="flex flex-1 items-end justify-between text-sm">
                    <div class="flex items-center space-x-2">
                      <button
                        type="button"
                        class="text-gray-500 hover:text-gray-700"
                        @click="updateItemQuantity(item, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                      >
                        <span class="sr-only">{{ $t('cart.decrease') }}</span>
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <span class="text-gray-500">{{ item.quantity }}</span>
                      <button
                        type="button"
                        class="text-gray-500 hover:text-gray-700"
                        @click="updateItemQuantity(item, item.quantity + 1)"
                      >
                        <span class="sr-only">{{ $t('cart.increase') }}</span>
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    <button
                      type="button"
                      class="font-medium text-indigo-600 hover:text-indigo-500"
                      @click="removeItem(item)"
                    >
                      {{ $t('cart.remove') }}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
          <div class="flex justify-between text-base font-medium text-gray-900">
            <p>{{ $t('cart.subtotal') }}</p>
            <p>{{ formatPrice(cart.totalPrice.value) }}</p>
          </div>
          <p class="mt-0.5 text-sm text-gray-500">{{ $t('cart.shipping') }}</p>
          
          <!-- Error message -->
          <div v-if="error" class="mt-4 p-4 bg-red-50 rounded-lg">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <div class="mt-6">
            <button
              type="button"
              data-checkout-button
              class="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              @click="handleProceedToPayment"
              :disabled="isLoading || cart.items.value.length === 0"
            >
              <span v-if="isLoading" class="flex items-center justify-center gap-2">
                <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                {{ $t('checkout.processing') }}
              </span>
              <span v-else>{{ $t('checkout.submit') }}</span>
            </button>
          </div>
          <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
            <p>
              {{ $t('cart.or') }}
              <button
                type="button"
                class="font-medium text-indigo-600 hover:text-indigo-500"
                @click="$emit('close')"
              >
                {{ $t('cart.continue') }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart';
import type { Product, ProductVariant } from '~/types/product';

interface CartItem {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
}

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'checkout'): void;
}>();

const cart = useCart();
const config = useRuntimeConfig();
const isLoading = ref(false);
const error = ref('');

const getImageUrl = (product: Product) => {
  const image = product.image?.[0];
  const baseUrl = config.public.strapiUrl;
  const imageUrl = image?.formats?.large?.url || image?.url;
  return imageUrl ? `${baseUrl}${imageUrl}` : '/placeholder.png';
};

const getItemTitle = (item: CartItem) => {
  return item.variant ? `${item.product.title} - ${item.variant.name}` : item.product.title;
};

const getItemPrice = (item: CartItem) => {
  return item.variant?.price ?? item.product.price ?? 0;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

const updateItemQuantity = (item: CartItem, quantity: number) => {
  if (quantity > 0) {
    cart.updateQuantity(item.product.id, item.variant?.id ?? null, quantity);
  }
};

const removeItem = (item: CartItem) => {
  cart.removeFromCart(item.product.id, item.variant?.id);
};

const handleProceedToPayment = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    // Create Stripe Checkout Session
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: cart.items.value.map(item => ({
          price: item.variant?.price ?? item.product.price,
          quantity: item.quantity,
          name: `${item.product.title}${item.variant ? ` - ${item.variant.name}` : ''}`,
          image: getImageUrl(item.product)
        }))
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { url } = await response.json();
    
    // Clear cart after successful checkout session creation
    cart.clearCart();
    
    // Redirect to Stripe Checkout
    window.location.href = url;
  } catch (err) {
    console.error('Error during checkout:', err);
    error.value = err instanceof Error ? err.message : 'An error occurred during checkout';
  } finally {
    isLoading.value = false;
  }
};
</script> 