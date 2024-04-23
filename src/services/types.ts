// Types used in project

export interface Product {
  productId: number;
  productName: string;
  price: number;
  weight: number;
}

export interface ProductOrder {
  orderId: number;
  quantity: number;
  product: Product;
}

export interface Delivery {
  deliveryId: number;
  deliveryDate: Date;
  destination: string;
  fromWarehouse: string;
  productOrders: Array<ProductOrder>;
}
