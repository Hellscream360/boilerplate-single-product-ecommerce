<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Luxury Watch Background"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/30"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 text-center text-white px-4">
        <h1 class="text-4xl md:text-6xl font-light tracking-wider mb-6">
          {{ $t('hero.title') }}
        </h1>
        <p class="text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto">
          {{ $t('hero.subtitle') }}
        </p>
        <NuxtLink
          to="/product"
          class="inline-block px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300"
        >
          {{ $t('hero.cta') }}
        </NuxtLink>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- Feature 1 -->
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-gray-50">
              <svg class="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('features.precision.title') }}</h3>
            <p class="text-gray-500 font-light">{{ $t('features.precision.description') }}</p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-gray-50">
              <svg class="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('features.craftsmanship.title') }}</h3>
            <p class="text-gray-500 font-light">{{ $t('features.craftsmanship.description') }}</p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-gray-50">
              <svg class="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('features.heritage.title') }}</h3>
            <p class="text-gray-500 font-light">{{ $t('features.heritage.description') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Preview -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <!-- Product Image -->
          <div class="relative">
            <img
              src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
              alt="Luxury Watch Preview"
              class="w-full h-auto rounded-lg shadow-xl"
            />
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <h2 class="text-3xl font-light text-gray-900">{{ $t('preview.title') }}</h2>
            <p class="text-gray-500 font-light">{{ $t('preview.description') }}</p>
            <ul class="space-y-4">
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ $t('preview.features.1') }}
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ $t('preview.features.2') }}
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ $t('preview.features.3') }}
              </li>
            </ul>
            <NuxtLink
              to="/product"
              class="inline-block px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-300"
            >
              {{ $t('preview.cta') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// No additional setup needed
</script>