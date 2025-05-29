<template>
  <button
    class="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
    @click="$emit('click')"
  >
    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
    <span
      v-if="totalItems > 0"
      class="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center"
    >
      {{ totalItems }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart';

const cart = useCart();
const totalItems = computed(() => cart.totalItems.value);

defineEmits<{
  (e: 'click'): void;
}>();
</script> 