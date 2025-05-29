export interface ProductImage {
  url: string;
  formats?: {
    large?: {
      url: string;
    };
  };
}

export interface ProductVariant {
  id: number;
  name: string;
  price?: number;
  available: boolean;
  image?: {
    url: string;
    formats?: {
      large?: {
        url: string;
      };
    };
  };
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  available: boolean;
  image?: {
    url: string;
    formats?: {
      large?: {
        url: string;
      };
    };
  }[];
  variants?: ProductVariant[];
}

export interface ProductResponse {
  data: Product[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
} 