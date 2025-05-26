<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div class="mb-6">
        <svg class="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('checkout.cancel.title') }}</h1>
      <p class="text-gray-600 mb-8">{{ $t('checkout.cancel.message') }}</p>
      <NuxtLink
        to="/"
        class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        {{ $t('checkout.cancel.backToHome') }}
      </NuxtLink>
    </div>
  </div>
</template> 