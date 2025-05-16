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
              <template v-if="currentStep === 'billing'">
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

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="firstName" class="block text-sm font-medium text-gray-700">{{ t('checkout.billing.firstName') }}</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        v-model="formData.firstName"
                        class="mt-1.5 block w-full rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition duration-150 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0"
                        :placeholder="t('checkout.billing.firstNamePlaceholder')"
                        required
                      >
                    </div>
                    <div>
                      <label for="lastName" class="block text-sm font-medium text-gray-700">{{ t('checkout.billing.lastName') }}</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        v-model="formData.lastName"
                        class="mt-1.5 block w-full rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition duration-150 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0"
                        :placeholder="t('checkout.billing.lastNamePlaceholder')"
                        required
                      >
                    </div>
                  </div>

                  <div>
                    <label for="address" class="block text-sm font-medium text-gray-700">{{ t('checkout.billing.address') }}</label>
                    <input 
                      type="text" 
                      id="address" 
                      v-model="formData.address"
                      class="mt-1.5 block w-full rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition duration-150 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0"
                      :placeholder="t('checkout.billing.addressPlaceholder')"
                      required
                    >
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="city" class="block text-sm font-medium text-gray-700">{{ t('checkout.billing.city') }}</label>
                      <input 
                        type="text" 
                        id="city" 
                        v-model="formData.city"
                        class="mt-1.5 block w-full rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition duration-150 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0"
                        :placeholder="t('checkout.billing.cityPlaceholder')"
                        required
                      >
                    </div>
                    <div>
                      <label for="postalCode" class="block text-sm font-medium text-gray-700">{{ t('checkout.billing.postalCode') }}</label>
                      <input 
                        type="text" 
                        id="postalCode" 
                        v-model="formData.postalCode"
                        class="mt-1.5 block w-full rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition duration-150 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0"
                        :placeholder="t('checkout.billing.postalCodePlaceholder')"
                        required
                      >
                    </div>
                  </div>

                  <div>
                    <label for="country" class="block text-sm font-medium text-gray-700">{{ t('checkout.billing.country') }}</label>
                    <select 
                      id="country" 
                      v-model="formData.country"
                      class="mt-1.5 block w-full rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition duration-150 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0"
                      required
                    >
                      <option value="">{{ t('checkout.billing.countrySelect') }}</option>
                      <option value="FR">{{ t('checkout.billing.countries.FR') }}</option>
                      <option value="US">{{ t('checkout.billing.countries.US') }}</option>
                      <option value="GB">{{ t('checkout.billing.countries.GB') }}</option>
                    </select>
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
              </template>

              <template v-else-if="currentStep === 'payment'">
                <div class="mb-6">
                  <button
                    type="button"
                    class="flex items-center text-sm text-gray-500 hover:text-gray-700"
                    @click="currentStep = 'billing'"
                  >
                    <svg class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back to Billing
                  </button>
                </div>

                <div class="mb-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                  <StripePaymentForm
                    v-if="clientSecret"
                    :amount="(product?.price * quantity).toFixed(2)"
                    :client-secret="clientSecret"
                    @success="handlePaymentSuccess"
                    @error="handlePaymentError"
                  />
                </div>
              </template>

              <template v-else-if="currentStep === 'completed'">
                <div class="mb-6">
                  <div v-if="paymentStatus === 'success'" class="rounded-lg bg-green-50 p-6 text-center">
                    <svg class="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 class="mt-4 text-lg font-medium text-green-800">Payment Successful!</h3>
                    <p class="mt-2 text-sm text-green-600">
                      Thank you for your purchase. A confirmation email will be sent to {{ formData.email }}.
                    </p>
                    <div v-if="emailPreviewUrl" class="mt-4 text-sm">
                      <a 
                        :href="emailPreviewUrl" 
                        target="_blank" 
                        class="text-indigo-600 hover:text-indigo-500 underline"
                      >
                        View Test Email
                      </a>
                      <p class="mt-1 text-gray-500 text-xs">
                        (Development mode: emails are not actually sent)
                      </p>
                    </div>
                    
                    <!-- Account creation suggestion -->
                    <div class="mt-6 border-t border-green-100 pt-6">
                      <p class="text-sm text-gray-600">Want to track your order and make future purchases easier?</p>
                      <button
                        @click="showAuthModal = true"
                        class="mt-3 w-full justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm ring-1 ring-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Create an Account
                      </button>
                    </div>

                    <button
                      @click="$emit('close')"
                      class="mt-4 w-full justify-center rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    >
                      Back to Shop
                    </button>
                  </div>

                  <div v-else-if="paymentStatus === 'error'" class="rounded-lg bg-red-50 p-6 text-center">
                    <svg class="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <h3 class="mt-4 text-lg font-medium text-red-800">Payment Failed</h3>
                    <p class="mt-2 text-sm text-red-600">
                      {{ paymentError }}
                    </p>
                    <div class="mt-6 space-y-3">
                      <button
                        @click="currentStep = 'payment'"
                        class="w-full justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                      >
                        Try Again
                      </button>
                      <button
                        @click="$emit('close')"
                        class="w-full justify-center rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm transition duration-150 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                      >
                        Cancel Payment
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  product: {
    type: Object,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
});

const config = useRuntimeConfig();

// Compute product image URL with proper Strapi domain
const productImage = computed(() => {
  const firstImage = props.product?.image?.[0];
  const imageUrl = firstImage?.formats?.thumbnail?.url || firstImage?.url;
  
  if (imageUrl?.startsWith('/')) {
    return `${config.public.strapiUrl}${imageUrl}`;
  }
  
  return imageUrl;
});

const emit = defineEmits(['close', 'proceed-to-payment']);
const { $stripe } = useNuxtApp();

const isLoading = ref(false);
const isMobile = ref(false);
const currentStep = ref('billing');
const clientSecret = ref(null);
const paymentStatus = ref(null);
const paymentError = ref('');
const emailPreviewUrl = ref('');
const showAuthModal = ref(false);

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
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postalCode: '',
  country: ''
});

const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 768; // md breakpoint
};

onMounted(() => {
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile);
});

const handleProceedToPayment = async () => {
  isLoading.value = true;
  try {
    // Call the API to create a payment intent
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: props.product.price * props.quantity,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const data = await response.json();
    clientSecret.value = data.clientSecret;
    currentStep.value = 'payment';
  } catch (error) {
    console.error('Error creating payment intent:', error);
    // Show error to user
    alert('There was an error processing your payment. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

const handlePaymentSuccess = async (paymentIntent) => {
  console.log('Payment successful:', paymentIntent);
  paymentStatus.value = 'success';
  
  try {
    // Send confirmation email
    const response = await fetch('/api/send-confirmation-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        orderDetails: {
          product: props.product,
          quantity: props.quantity,
          amount: (props.product.price * props.quantity).toFixed(2),
          paymentIntentId: paymentIntent.id
        }
      }),
    });

    const data = await response.json();
    if (data.previewUrl) {
      emailPreviewUrl.value = data.previewUrl;
    }
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }

  currentStep.value = 'completed';
};

const handlePaymentError = (error) => {
  console.error('Payment failed:', error);
  paymentStatus.value = 'error';
  paymentError.value = error.message || 'An error occurred during payment.';
  currentStep.value = 'completed';
};

const handleBackdropClick = (event) => {
  // Only close if clicking the backdrop (not the panel itself)
  if (event.target === event.currentTarget) {
    emit('close');
  }
};
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