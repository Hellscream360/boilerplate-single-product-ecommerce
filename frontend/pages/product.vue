<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid md:grid-cols-2 gap-8">
      <!-- Product image -->
      <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          src="https://placehold.co/600x600"
          alt="Product image"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Product details -->
      <div class="flex flex-col">
        <h1 class="text-3xl font-bold text-gray-900">Product Name</h1>
        <div class="mt-4">
          <p class="text-2xl font-semibold text-gray-900">$99.99</p>
        </div>
        <div class="mt-4">
          <p class="text-gray-600">
            Detailed description of your product. Explain here what makes your product unique and why customers should buy it.
          </p>
        </div>
        <div class="mt-8">
          <button
            class="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
            @click="handleBuyNow"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const handleBuyNow = () => {
  // TODO: Integrate with Stripe Checkout
  console.log('Processing purchase...')
}
</script> 