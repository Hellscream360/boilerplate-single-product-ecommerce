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
                <span class="sr-only">Close panel</span>
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
              <h3 class="text-lg font-medium text-gray-900">Checkout</h3>
              <button 
                type="button"
                class="text-gray-500 hover:text-gray-600"
                @click="$emit('close')"
              >
                <span class="sr-only">Close panel</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            <!-- Panel content -->
            <div class="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              <!-- Order summary -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4" v-if="!isMobile">Order Summary</h3>
                <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                  <img 
                    :src="productImage" 
                    :alt="product?.title" 
                    class="w-16 h-16 object-contain"
                  >
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900">{{ product?.title }}</h4>
                    <div class="mt-1 flex items-center justify-between">
                      <p class="text-gray-600">${{ product?.price }} × {{ quantity }}</p>
                      <p class="font-medium text-gray-900">${{ (product?.price * quantity).toFixed(2) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Billing information form -->
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="formData.email"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="firstName" class="block text-sm font-medium text-gray-700">First name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      v-model="formData.firstName"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    >
                  </div>
                  <div>
                    <label for="lastName" class="block text-sm font-medium text-gray-700">Last name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      v-model="formData.lastName"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    >
                  </div>
                </div>

                <div>
                  <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                  <input 
                    type="text" 
                    id="address" 
                    v-model="formData.address"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                    <input 
                      type="text" 
                      id="city" 
                      v-model="formData.city"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    >
                  </div>
                  <div>
                    <label for="postalCode" class="block text-sm font-medium text-gray-700">Postal code</label>
                    <input 
                      type="text" 
                      id="postalCode" 
                      v-model="formData.postalCode"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    >
                  </div>
                </div>

                <div>
                  <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
                  <select 
                    id="country" 
                    v-model="formData.country"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a country</option>
                    <option value="FR">France</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                </div>
              </form>
            </div>

            <!-- Fixed bottom section with action buttons -->
            <div class="border-t border-gray-200 py-6 px-4 sm:px-6">
              <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>${{ (product?.price * quantity).toFixed(2) }}</p>
                </div>
                <button 
                  type="button" 
                  @click="handleProceedToPayment"
                  class="w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading">Processing...</span>
                  <span v-else>Proceed to Payment</span>
                </button>
                <button 
                  type="button" 
                  @click="$emit('close')"
                  class="w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';

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

const isLoading = ref(false);
const isMobile = ref(false);

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

const formData = ref({
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
    emit('proceed-to-payment', {
      billingDetails: formData.value,
      product: props.product
    });
  } catch (error) {
    console.error('Error processing payment:', error);
  } finally {
    isLoading.value = false;
  }
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