<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center">
          <NuxtLink :to="localePath('/')" class="text-xl font-bold text-gray-900 cursor-pointer">
            SingleProduct
          </NuxtLink>
        </div>
        <div class="flex items-center">
          <AuthButton class="mr-4" />
          <CartButton @click="isCartOpen = true" />
        </div>
      </nav>
    </header>

    <!-- Main content -->
    <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Cart Panel -->
    <CartPanel
      :is-open="isCartOpen"
      @close="isCartOpen = false"
      @checkout="handleCheckout"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Footer from '~/components/Footer.vue';
import CartButton from '~/components/CartButton.vue';
import CartPanel from '~/components/CartPanel.vue';
import { useCartStore } from '~/stores/cart';

const localePath = useLocalePath();
const isCartOpen = ref(false);
const cartStore = useCartStore();

onMounted(() => {
  cartStore.initCart();
});

const handleCheckout = () => {
  isCartOpen.value = false;
  // TODO: Implement checkout logic
};
</script>


