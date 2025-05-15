<template>
  <div class="space-y-24">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900">
              Discover Our Innovative Product
            </h1>
            <p class="text-xl text-gray-600">
              A unique solution that will revolutionize your daily life. Simple, effective, and accessible.
            </p>
            <div class="flex gap-4">
              <a href="#discover" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Learn More
              </a>
              <a href="/product" class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Buy Now →
              </a>
            </div>
          </div>
          <div class="relative h-96">
            <img
              src="https://placehold.co/800x600"
              alt="Hero image"
              class="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="discover" class="bg-gray-50 py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900">Why Choose Us?</h2>
          <p class="mt-4 text-xl text-gray-600">Unique features for an exceptional experience</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Performance</h3>
            <p class="mt-2 text-gray-600">Fast and efficient results for your satisfaction.</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Security</h3>
            <p class="mt-2 text-gray-600">Optimal protection for your peace of mind.</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Simplicity</h3>
            <p class="mt-2 text-gray-600">Intuitive usage for all users.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-indigo-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-white">Ready to Start?</h2>
          <p class="mt-4 text-xl text-indigo-100">
            Join thousands of satisfied users today.
          </p>
          <div class="mt-8">
            <a href="/product" class="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50">
              Discover the Product
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const handleBuyNow = () => {
  // TODO: Intégrer avec Stripe Checkout
  console.log('Achat en cours...')
}
</script> 