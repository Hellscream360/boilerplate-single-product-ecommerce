import { useCartStore } from '~/stores/cart';
import { computed } from 'vue';
import type { Product, ProductVariant } from '~/types/product';

interface CartItem {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
}

export const useCart = () => {
  const cartStore = useCartStore();

  return {
    items: computed(() => cartStore.items),
    totalItems: computed(() => cartStore.totalItems),
    totalPrice: computed(() => cartStore.totalPrice),
    addToCart: cartStore.addToCart,
    removeFromCart: cartStore.removeFromCart,
    updateQuantity: cartStore.updateQuantity,
    clearCart: cartStore.clearCart
  };
}; 