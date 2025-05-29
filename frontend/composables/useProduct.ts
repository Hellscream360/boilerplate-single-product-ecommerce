import { ref, computed, watch } from 'vue';
import type { Product, ProductVariant } from '~/types/product';

export const useProduct = (product: Product | null) => {
  const selectedVariant = ref<ProductVariant | null>(null);
  const quantity = ref(1);

  // Select "Classic" variant by default
  watch(() => product, (newProduct) => {
    if (newProduct?.variants) {
      const classicVariant = newProduct.variants.find(v => v.name === 'Classic');
      if (classicVariant) {
        selectedVariant.value = classicVariant;
      }
    }
  }, { immediate: true });

  const currentPrice = computed(() => 
    selectedVariant.value?.price ?? product?.price ?? 0
  );

  const isAvailable = computed(() => 
    selectedVariant.value?.available ?? product?.available ?? false
  );

  const currentImage = computed(() => {
    if (selectedVariant.value?.image) {
      return selectedVariant.value.image;
    }
    return product?.image?.[0] ?? null;
  });

  const formattedImageUrl = computed(() => {
    const image = currentImage.value;
    if (!image) return null;

    const imageUrl = image.formats?.large?.url || image.url;
    if (!imageUrl) return null;

    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? useRuntimeConfig().public.strapiUrl 
      : 'http://localhost:1337';

    return new URL(imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`, baseUrl).toString();
  });

  const totalPrice = computed(() => 
    currentPrice.value * quantity.value
  );

  const selectVariant = (variant: ProductVariant) => {
    selectedVariant.value = variant;
  };

  const incrementQuantity = () => {
    quantity.value++;
  };

  const decrementQuantity = () => {
    if (quantity.value > 1) {
      quantity.value--;
    }
  };

  return {
    selectedVariant,
    quantity,
    currentPrice,
    isAvailable,
    currentImage,
    formattedImageUrl,
    totalPrice,
    selectVariant,
    incrementQuantity,
    decrementQuantity
  };
}; 