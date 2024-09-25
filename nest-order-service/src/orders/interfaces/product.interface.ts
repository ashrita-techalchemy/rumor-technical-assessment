// product.interface.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  availableQuantity: number;
}

export interface ProductById {
  id: number;
}
