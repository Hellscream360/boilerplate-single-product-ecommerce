<template>
  <div class="min-h-screen bg-gray-50">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
      <div class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="mb-6">
          <svg class="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('checkout.success.title') }}</h1>
        <p class="text-gray-600 mb-8">{{ $t('checkout.success.message') }}</p>
        <NuxtLink
          to="/"
          class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {{ $t('checkout.success.backToHome') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

onMounted(async () => {
  const sessionId = route.query.session_id;
  if (sessionId) {
    // You could verify the session status here if needed
    console.log('Payment successful for session:', sessionId);
  }
});
</script> 