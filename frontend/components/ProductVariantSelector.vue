<template>
  <div v-if="safeVariants.length > 0" class="mt-4">
    <h3 class="text-sm font-medium text-gray-900">{{ $t('product.variants') }}</h3>
    <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
      <button
        v-for="variant in safeVariants"
        :key="variant.id"
        @click="selectVariant(variant)"
        class="group relative flex flex-col items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none"
        :class="[
          selectedVariantId === variant.id
            ? 'border-indigo-600 bg-indigo-50'
            : 'border-gray-300',
          !variant.available && 'opacity-75 cursor-not-allowed'
        ]"
        :disabled="!variant.available"
      >
        <span>{{ variant.name }}</span>
        <span
          v-if="selectedVariantId === variant.id"
          class="absolute inset-y-0 right-0 flex items-center pr-4"
        >
          <svg class="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <span
          v-if="!variant.available"
          class="mt-1 text-[10px] font-medium text-red-500"
        >
          {{ $t('product.outOfStock') }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { ProductVariant } from '~/types/product';
import { useCart } from '~/composables/useCart';

const props = defineProps<{
  variants: ProductVariant[];
  initialVariantId?: number;
  product: any;
  quantity: number;
}>();

const emit = defineEmits<{
  (e: 'select', variant: ProductVariant): void;
}>();

const cart = useCart();

// Vérification de sécurité pour les variantes
const safeVariants = computed(() => {
  const variants = props.variants || [];
  return [...variants].sort((a, b) => a.name.localeCompare(b.name));
});

const selectedVariantId = ref<number | null>(props.initialVariantId || null);

watch(() => props.initialVariantId, (newId) => {
  if (newId) {
    selectedVariantId.value = newId;
  }
});

const selectVariant = (variant: ProductVariant) => {
  if (!variant.available) return;
  selectedVariantId.value = variant.id;
  emit('select', variant);
  
  cart.addToCart(props.product, variant, props.quantity);
};
</script> 