import { makeOptions, handleHttpErrors } from "./fetchUtils";
import { API_URL } from "../settings";
import { Product, Delivery } from "./types";

// Omit deliveryId from Delivery type
type NewDelivery = Omit<Delivery, "deliveryId">;

// GET REQUESTS
async function getProducts() {
  const options = makeOptions("GET", null, undefined, false);
  return fetch(`${API_URL}/products`, options).then(handleHttpErrors);
}

async function getDeliveries() {
  const options = makeOptions("GET", null, undefined, false);
  return fetch(`${API_URL}/deliveries`, options).then(handleHttpErrors);
}

async function getProductOrders() {
  const options = makeOptions("GET", null, undefined, false);
  return fetch(`${API_URL}/productOrders`, options).then(handleHttpErrors);
}

// POST REQUESTS
async function addProduct(product: Product) {
  const options = makeOptions("POST", product, undefined, false);
  return fetch(`${API_URL}/products`, options).then(handleHttpErrors);
}

async function addDelivery(delivery: NewDelivery) {
  const options = makeOptions("POST", delivery, undefined, false);
  return fetch(`${API_URL}/deliveries`, options).then(handleHttpErrors);
}

// DELETE REQUESTS
async function removeProduct(product: Product) {
  const options = makeOptions("DELETE", null, undefined, false);
  return fetch(`${API_URL}/products/${product.productId}`, options).then(
    handleHttpErrors
  );
}

async function removeDelivery(delivery: Delivery) {
  const options = makeOptions("DELETE", null, undefined, false);
  return fetch(`${API_URL}/deliveries/${delivery.deliveryId}`, options).then(
    handleHttpErrors
  );
}

// PUT REQUESTS
async function editProduct(newProduct: Product) {
  console.log(newProduct);
  const options = makeOptions("PUT", newProduct, undefined, false);
  return fetch(`${API_URL}/products/${newProduct.productId}`, options).then(
    handleHttpErrors
  );
}

async function editDelivery(newDelivery: Delivery) {
  const options = makeOptions("PUT", newDelivery, undefined, false);
  return fetch(`${API_URL}/deliveries/${newDelivery.deliveryId}`, options).then(
    handleHttpErrors
  );
}

export {
  getProducts,
  addProduct,
  removeProduct,
  editProduct,
  getDeliveries,
  addDelivery,
  removeDelivery,
  editDelivery,
  getProductOrders,
};
