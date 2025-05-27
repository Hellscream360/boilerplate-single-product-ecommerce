<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50"
    @click="handleBackdropClick"
  >
    <!-- Semi-transparent backdrop -->
    <Transition
      enter="transition-opacity ease-out duration-300"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="transition-opacity ease-in duration-200"
      leave-from="opacity-100"
      leave-to="opacity-0"
    >
      <div 
        v-show="isOpen && isMobile"
        class="absolute inset-0 bg-gray-500 bg-opacity-25"
      ></div>
    </Transition>

    <!-- Panel container -->
    <div 
      class="fixed inset-y-0 right-0 flex max-w-full"
      :class="{ 'bottom-0 left-0 w-full': isMobile }"
    >
      <Transition
        :name="isMobile ? 'slide-up' : 'slide-left'"
        appear
      >
        <!-- Actual panel -->
        <div 
          v-show="isOpen"
          class="w-screen transform"
          :class="{
            'max-w-md': !isMobile,
          }"
        >
          <div class="flex h-screen flex-col bg-white shadow-xl">
            <!-- Desktop close button -->
            <div 
              v-if="!isMobile"
              class="absolute top-0 right-0 p-4"
            >
              <button 
                type="button" 
                class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none" 
                @click="$emit('close')"
              >
                <span class="sr-only">{{ t('checkout.close') }}</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Mobile header with chevron -->
            <div 
              v-if="isMobile"
              class="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50"
            >
              <h3 class="text-lg font-medium text-gray-900">{{ t('checkout.title') }}</h3>
              <button 
                type="button"
                class="text-gray-500 hover:text-gray-600"
                @click="$emit('close')"
              >
                <span class="sr-only">{{ t('checkout.close') }}</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            <!-- Panel content -->
            <div class="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              <!-- Order summary -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4" v-if="!isMobile">{{ t('checkout.orderSummary') }}</h3>
                <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                  <img 
                    :src="productImage" 
                    :alt="product?.title" 
                    class="w-16 h-16 object-contain"
                  >
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900">{{ product?.title }}</h4>
                    <div class="mt-1 flex items-center justify-between">
                      <p class="text-gray-600">{{ product?.price }}€ × {{ quantity }}</p>
                      <p class="font-medium text-gray-900">{{ (product?.price * quantity).toFixed(2) }}€</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Billing information form -->
              <form @submit.prevent="handleProceedToPayment" class="space-y-6">
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">{{ t('checkout.billing.email') }}</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="formData.email"
                    class="mt-1.5 block w-full rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition duration-150 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0"
                    :placeholder="t('checkout.billing.emailPlaceholder')"
                    required
                  >
                </div>

                <!-- Error message -->
                <div v-if="error" class="mt-4 p-4 bg-red-50 rounded-lg">
                  <p class="text-sm text-red-600">{{ error }}</p>
                </div>

                <!-- Submit button -->
                <div class="mt-6">
                  <button
                    type="submit"
                    class="w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
                    :disabled="isLoading"
                  >
                    <span v-if="isLoading" class="flex items-center justify-center gap-2">
                      <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      {{ t('checkout.processing') }}
                    </span>
                    <span v-else>{{ t('checkout.submit') }}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNuxtApp } from '#app';

interface PaymentIntent {
  id: string;
  status: string;
  client_secret: string;
}

const { t } = useI18n();
const props = defineProps<{
  isOpen: boolean;
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
  };
  quantity: number;
}>();

const config = useRuntimeConfig();
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { $strapi } = useNuxtApp();
const user = ref($strapi.user);

const isLoading = ref(false);
const isMobile = ref(window?.innerWidth < 640);
const error = ref('');

// Watch isOpen to manage body scroll and transitions
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.classList.add('overflow-hidden');
  } else {
    // Add a small delay to remove the class after the transition
    setTimeout(() => {
      document.body.classList.remove('overflow-hidden');
    }, 300);
  }
});

const formData = reactive({
  email: ''
});

const productImage = computed(() => {
  const imageUrl = props.product?.image;
  
  if (!imageUrl || typeof imageUrl !== 'string') {
    return '';
  }
  
  // If the image URL is already absolute, return it as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Otherwise, prepend the Strapi URL
  return `${config.public.strapiUrl}${imageUrl}`;
});

const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 768; // md breakpoint
};

onMounted(async () => {
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
  
  // Récupérer l'utilisateur connecté
  const currentUser = await $strapi.getUser();
  if (currentUser?.email) {
    formData.email = currentUser.email;
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile);
});

const handleProceedToPayment = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    // Create order in Strapi first
    const orderResponse = await fetch(`${config.public.strapiUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          customerName: '',
          customerEmail: formData.email,
          total: props.product.price * props.quantity,
          shippingAddress: {
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            postalCode: '',
            country: '',
          },
          stripeSessionId: '',
          status: 'pending'
        }
      }),
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to create order');
    }

    const order = await orderResponse.json();

    // Create Stripe Checkout Session
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price: props.product.price,
        quantity: props.quantity,
        productName: props.product.title,
        productImage: productImage.value,
        customerEmail: formData.email,
        customerName: '',
        shippingAddress: {
          address: '',
          city: '',
          postalCode: '',
          country: '',
        },
        metadata: {
          orderId: order.data.id
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { url } = await response.json();
    
    // Redirect to Stripe Checkout
    window.location.href = url;
  } catch (err) {
    console.error('Error during checkout:', err);
    error.value = err instanceof Error ? err.message : 'An error occurred during checkout';
  } finally {
    isLoading.value = false;
  }
};

const handleBackdropClick = (event: MouseEvent) => {
  // Only close if clicking the backdrop
  if ((event.target as HTMLElement).classList.contains('fixed')) {
    emit('close');
  }
};

// Handle mobile responsiveness
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 640;
  });
}
</script>

<style scoped>
/* Mobile transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  transform: translateY(100%);
}

.slide-up-leave-to {
  transform: translateY(100%);
}

/* Desktop transitions */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(100%);
}

/* Backdrop transition */
.backdrop-enter-active {
  transition: opacity 0.3s ease-out;
}
.backdrop-leave-active {
  transition: opacity 0.2s ease-in;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}
</style> 