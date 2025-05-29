import { defineStore } from 'pinia';
import type { Product, ProductVariant, ProductImage } from '~/types/product';
import { getCookie, setCookie, deleteCookie } from '~/utils/cookies';

interface CartItem {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
}

interface SerializedCartItem {
  product: {
    id: number;
    title: string;
    price: number;
    image: ProductImage[];
    description: string;
    available: boolean;
  };
  variant: {
    id: number;
    name: string;
    price?: number;
    available: boolean;
    image?: ProductImage;
  } | null;
  quantity: number;
}

const CART_COOKIE_NAME = 'cart';

const serializeCart = (items: CartItem[]): SerializedCartItem[] => {
  return items.map(item => ({
    product: {
      id: item.product.id,
      title: item.product.title,
      price: item.product.price,
      image: item.product.image || [],
      description: item.product.description,
      available: item.product.available
    },
    variant: item.variant ? {
      id: item.variant.id,
      name: item.variant.name,
      price: item.variant.price,
      available: item.variant.available,
      image: item.variant.image
    } : null,
    quantity: item.quantity
  }));
};

const deserializeCart = (data: SerializedCartItem[]): CartItem[] => {
  return data.map(item => ({
    product: {
      id: item.product.id,
      title: item.product.title,
      price: item.product.price,
      image: item.product.image,
      description: item.product.description,
      available: item.product.available
    },
    variant: item.variant ? {
      id: item.variant.id,
      name: item.variant.name,
      price: item.variant.price,
      available: item.variant.available,
      image: item.variant.image
    } : null,
    quantity: item.quantity
  }));
};

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum: number, item: CartItem) => {
      const price = item.variant?.price ?? item.product.price ?? 0;
      return sum + (price * item.quantity);
    }, 0)
  },

  actions: {
    initCart() {
      if (import.meta.client) {
        const savedCart = getCookie(CART_COOKIE_NAME);        
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            const deserializedCart = deserializeCart(parsedCart);
            this.items = deserializedCart;
          } catch (error) {
            console.error('Error parsing cart:', error);
            this.items = [];
          }
        }
      }
    },

    saveCart() {
      if (import.meta.client) {
        const serializedCart = serializeCart(this.items);
        setCookie(CART_COOKIE_NAME, JSON.stringify(serializedCart));
      }
    },

    addToCart(product: Product, variant: ProductVariant | null, quantity: number) {
      const existingItemIndex = this.items.findIndex(
        (item: CartItem) => item.product.id === product.id && 
        ((!item.variant && !variant) || (item.variant?.id === variant?.id))
      );

      if (existingItemIndex > -1) {
        this.items[existingItemIndex].quantity += quantity;
      } else {
        this.items.push({
          product,
          variant,
          quantity
        });
      }
      this.saveCart();
    },

    removeFromCart(productId: number, variantId?: number) {
      this.items = this.items.filter(
        (item: CartItem) => !(item.product.id === productId && 
          ((!item.variant && !variantId) || (item.variant?.id === variantId)))
      );
      this.saveCart();
    },

    updateQuantity(productId: number, variantId: number | null, quantity: number) {
      const item = this.items.find(
        (item: CartItem) => item.product.id === productId && 
        ((!item.variant && !variantId) || (item.variant?.id === variantId))
      );
      if (item) {
        item.quantity = quantity;
        this.saveCart();
      }
    },

    clearCart() {
      this.items = [];
      if (import.meta.client) {
        deleteCookie(CART_COOKIE_NAME);
      }
    }
  }
}); 