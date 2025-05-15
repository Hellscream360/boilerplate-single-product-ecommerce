<template>
  <div class="w-full">
    <!-- Test mode notice -->
    <div class="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-600">
      <p class="font-medium mb-1">Mode Test - Utilisez ces cartes :</p>
      <ul class="list-disc pl-4 space-y-1">
        <li>Succès : 4242 4242 4242 4242</li>
        <li>Échec : 4000 0000 0000 0002</li>
      </ul>
      <p class="mt-2">Date d'expiration : future, CVC : 3 chiffres</p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-500">
      {{ error }}
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div id="card-element" class="min-h-[20px]"></div>
      </div>

      <button
        type="submit"
        class="w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
        :disabled="isProcessing"
      >
        <span v-if="isProcessing" class="flex items-center justify-center gap-2">
          <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Processing...
        </span>
        <span v-else>
          Payer {{ amount }}€
        </span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  amount: {
    type: [Number, String],
    required: true
  },
  clientSecret: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['success', 'error']);
const { $stripe } = useNuxtApp();

const error = ref('');
const isProcessing = ref(false);
let elements = null;
let card = null;

onMounted(async () => {
  // Create Stripe Elements instance
  elements = $stripe.elements({
    clientSecret: props.clientSecret
  });

  // Create and mount the Card Element
  card = elements.create('card', {
    style: {
      base: {
        fontSize: '16px',
        color: '#374151',
        '::placeholder': {
          color: '#9CA3AF',
        },
      },
    },
  });
  
  card.mount('#card-element');

  // Handle validation errors
  card.on('change', (event) => {
    error.value = event.error ? event.error.message : '';
  });
});

const handleSubmit = async () => {
  if (!card || !elements) {
    return;
  }

  isProcessing.value = true;
  error.value = '';

  try {
    const result = await $stripe.confirmCardPayment(props.clientSecret, {
      payment_method: {
        card: card,
      },
    });

    if (result.error) {
      error.value = result.error.message;
      emit('error', result.error);
    } else {
      emit('success', result.paymentIntent);
    }
  } catch (e) {
    error.value = 'An unexpected error occurred.';
    emit('error', e);
  } finally {
    isProcessing.value = false;
  }
};
</script> 