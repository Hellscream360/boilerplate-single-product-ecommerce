<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header 
      class="w-full bg-white z-50 border-b border-gray-100 transition-all duration-300"
      :class="{ 'fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md': isScrolled }"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink :to="localePath('/')" class="flex items-center space-x-2">
            <span class="text-xl font-light tracking-wider text-gray-900">LUXE</span>
          </NuxtLink>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <NuxtLink :to="localePath('/')" class="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors">
              {{ t('nav.home') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/about')" class="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors">
              {{ t('nav.about') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/contact')" class="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors">
              {{ t('nav.contact') }}
            </NuxtLink>
          </nav>

          <!-- Right side buttons -->
          <div class="flex items-center space-x-4">
            <AuthButton class="mr-4" />
            <CartButton @click="isCartOpen = true" />
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main :class="{ 'pt-16': isScrolled }">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Brand -->
          <div class="space-y-4">
            <h3 class="text-lg font-light tracking-wider text-gray-900">LUXE</h3>
            <p class="text-sm text-gray-500 font-light">
              {{ t('footer.description') }}
            </p>
          </div>

          <!-- Quick links -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-gray-900">{{ t('footer.quickLinks') }}</h4>
            <ul class="space-y-2">
              <li>
                <NuxtLink :to="localePath('/')" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {{ t('nav.home') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/about')" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {{ t('nav.about') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/contact')" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {{ t('nav.contact') }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-gray-900">{{ t('footer.contact') }}</h4>
            <ul class="space-y-2">
              <li class="text-sm text-gray-500">
                contact@luxe.fr
              </li>
              <li class="text-sm text-gray-500">
                {{ t('footer.phone') }}
              </li>
            </ul>
          </div>

          <!-- Language Selector -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-gray-900">{{ t('footer.language') }}</h4>
            <div class="flex space-x-4">
              <button
                @click="switchLanguage('fr')"
                class="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                :class="{ 'font-medium text-gray-900': locale === 'fr' }"
              >
                FR
              </button>
              <button
                @click="switchLanguage('en')"
                class="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                :class="{ 'font-medium text-gray-900': locale === 'en' }"
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="mt-12 pt-8 border-t border-gray-100">
          <p class="text-sm text-gray-500 text-center">
            © {{ new Date().getFullYear() }} LUXE. {{ t('footer.rights') }}
          </p>
        </div>
      </div>
    </footer>

    <!-- Cart Panel -->
    <CartPanel
      :is-open="isCartOpen"
      @close="isCartOpen = false"
      @checkout="handleCheckout"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import CartButton from '~/components/CartButton.vue';
import CartPanel from '~/components/CartPanel.vue';
import { useCartStore } from '~/stores/cart';
import { useI18n } from 'vue-i18n';

const localePath = useLocalePath();
const { locale, t } = useI18n();
const isCartOpen = ref(false);
const cartStore = useCartStore();
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0;
};

onMounted(() => {
  cartStore.initCart();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const switchLanguage = (lang) => {
  locale.value = lang;
};

const handleCheckout = () => {
  isCartOpen.value = false;
  // TODO: Implement checkout logic
};
</script>


