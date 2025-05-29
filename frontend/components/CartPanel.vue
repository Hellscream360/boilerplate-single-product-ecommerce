<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden" @click="handleOutsideClick">
    <div class="absolute inset-0 bg-transparent bg-opacity-50 transition-opacity" />
    <div class="fixed inset-y-0 right-0 flex w-full sm:w-auto sm:max-w-full sm:pl-10">
      <div class="w-full sm:w-screen sm:max-w-md" @click.stop>
        <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
          <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div class="flex items-start justify-between">
              <h2 class="text-lg font-medium text-gray-900">{{ $t('cart.title') }}</h2>
              <div class="ml-3 flex h-7 items-center">
                <button
                  type="button"
                  class="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                  @click="closeCart"
                >
                  <span class="absolute -inset-0.5" />
                  <span class="sr-only">{{ $t('cart.close') }}</span>
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
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
                  @click="closeCart"
                >
                  {{ $t('cart.continue') }}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart';
import type { Product, ProductVariant } from '~/types/product';
import { useI18n } from 'vue-i18n';

interface CartItem {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
}

const cart = useCart();
const config = useRuntimeConfig();
const isLoading = ref(false);
const error = ref('');

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'checkout'): void;
}>();

// Prevent body scrolling when cart is open
if (import.meta.client) {
  document.body.style.overflow = props.isOpen ? 'hidden' : '';
}

// Re-enable body scrolling when cart is closed
onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = '';
  }
});

const closeCart = () => {
  emit('close');
};

const handleOutsideClick = (event: MouseEvent) => {
  // Check if click is outside the panel
  const target = event.target as HTMLElement;
  if (!target.closest('.w-screen.max-w-md')) {
    closeCart();
  }
};

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
    const response = await $fetch('/api/create-payment-intent', {
      method: 'POST',
      body: {
        items: cart.items.value.map((item: CartItem) => ({
          productId: item.product.id,
          variantId: item.variant?.id,
          quantity: item.quantity,
          price: item.variant?.price ?? item.product.price,
          name: item.variant ? `${item.product.title} - ${item.variant.name}` : item.product.title,
          image: getImageUrl(item.product)
        }))
      }
    });

    if (response.url) {
      // Clear cart before redirecting to Stripe
      cart.clearCart();
      window.location.href = response.url;
    }
  } catch (err: any) {
    console.error('Payment error:', err);
    error.value = err.message || 'An error occurred during payment';
  } finally {
    isLoading.value = false;
  }
};
</script> 