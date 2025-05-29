import { defineStore } from 'pinia';
import type { Product, ProductVariant } from '~/types/product';

interface CartItem {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => {
      const price = item.variant?.price ?? item.product.price ?? 0;
      return sum + (price * item.quantity);
    }, 0)
  },

  actions: {
    addToCart(product: Product, variant: ProductVariant | null, quantity: number) {
      const existingItemIndex = this.items.findIndex(
        item => item.product.id === product.id && 
        ((!item.variant && !variant) || (item.variant?.id === variant?.id))
      );

      if (existingItemIndex > -1) {
        // Si l'item existe déjà, on met à jour la quantité
        this.items[existingItemIndex].quantity += quantity;
      } else {
        // Sinon, on ajoute un nouvel item
        this.items.push({
          product,
          variant,
          quantity
        });
      }
    },

    removeFromCart(productId: number, variantId?: number) {
      this.items = this.items.filter(
        item => !(item.product.id === productId && 
          ((!item.variant && !variantId) || (item.variant?.id === variantId)))
      );
    },

    updateQuantity(productId: number, variantId: number | null, quantity: number) {
      const item = this.items.find(
        item => item.product.id === productId && 
        ((!item.variant && !variantId) || (item.variant?.id === variantId))
      );
      if (item) {
        item.quantity = quantity;
      }
    },

    clearCart() {
      this.items = [];
    }
  }
}); 