  import { Product } from "./product";

  export interface CartItem {
    id: number;
    cart?: number;
    product: Product;
    quantity: number;
    price: number;
    userId?: number;
  }
