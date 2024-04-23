import { useEffect, useState } from "react";
import { Delivery, ProductOrder } from "../services/types";
import { addDelivery, getProductOrders } from "../services/apiFacade";
import "./AddDeliveries.css";

export default function AddDelivery() {
  type NewDelivery = Omit<Delivery, "deliveryId">;

  const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);
  const [err, setErr] = useState("");

  const [selectedProductOrders, setSelectedProductOrders] = useState<
    ProductOrder[]
  >([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [totalWeight, setTotalWeight] = useState<number>(0);

  // Fetch data
  useEffect(() => {
    getProductOrders()
      .then((res) => setProductOrders(res))
      .catch(() => setErr("Error fetching users, is the server running?"));
  });

  const handleCheckboxChange = (productOrder: ProductOrder) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setSelectedProductOrders([...selectedProductOrders, productOrder]);
        setTotalCost(
          totalCost + productOrder.quantity * productOrder.product.price
        );
        setTotalWeight(
          totalWeight + productOrder.quantity * productOrder.product.weight
        );
      } else {
        setSelectedProductOrders(
          selectedProductOrders.filter(
            (order) => order.orderId !== productOrder.orderId
          )
        );
        setTotalCost(
          totalCost - productOrder.quantity * productOrder.product.price
        );
        setTotalWeight(
          totalWeight - productOrder.quantity * productOrder.product.weight
        );
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const deliveryDateInput = form.elements.namedItem(
      "deliveryDate"
    ) as HTMLInputElement;
    const fromWarehouseInput = form.elements.namedItem(
      "fromWarehouse"
    ) as HTMLInputElement;
    const destinationInput = form.elements.namedItem(
      "destination"
    ) as HTMLInputElement;
    const productOrdersSelect = form.elements.namedItem(
      "productOrders"
    ) as HTMLSelectElement;

    if (productOrdersSelect === null) {
      console.error("Element with name 'productOrders' not found in form");
      return;
    }

    const selectedProductOrders = Array.from(
      productOrdersSelect.selectedOptions
    )
      .map((option) => {
        const id = Number(option.value);
        return productOrders.find(
          (productOrder) => productOrder.orderId === id
        );
      })
      .filter(
        (productOrder): productOrder is ProductOrder =>
          productOrder !== undefined
      );

    const newDelivery: NewDelivery = {
      deliveryDate: deliveryDateInput.value
        ? new Date(deliveryDateInput.value)
        : new Date(),
      fromWarehouse: fromWarehouseInput.value,
      destination: destinationInput.value,
      productOrders: selectedProductOrders,
    };
    console.log(deliveryDateInput);
    console.log(fromWarehouseInput);
    console.log(destinationInput);
    console.log(productOrdersSelect.selectedOptions);

    console.log(newDelivery);

    // Clear the form before starting the async operation
    e.currentTarget.reset();

    try {
      await addDelivery(newDelivery);
      setErr("");
      // window.location.href = "/";
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e.message);
      } else {
        setErr("An error occurred");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} id="add-product-form">
      <h1 className="double-griditem">Add a new delivery</h1>
      <label htmlFor="deliveryDate">Date:</label>
      <input
        type="date"
        id="deliveryDate"
        name="deliveryDate"
        placeholder="18/11/1996"
        required
      />
      <label htmlFor="destination">Destination:</label>
      <input
        type="text"
        id="destination"
        name="destination"
        placeholder="MinKøbmand Frederiksberg"
        required
      />
      <label htmlFor="fromWarehouse">Warehouse:</label>
      <input
        type="text"
        id="fromWarehouse"
        name="fromWarehouse"
        placeholder="Glostrup Industri Lager"
        required
      />
      <div className="double-griditem">
        {productOrders.map((productOrder, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`productOrder-${productOrder.orderId}`}
              name="productOrders"
              value={productOrder.orderId}
              onChange={handleCheckboxChange(productOrder)}
            />
            <label htmlFor={`productOrder-${productOrder.orderId}`}>
              {productOrder.product.productName} | {productOrder.quantity} stk.
              {" | "}
              {productOrder.quantity * productOrder.product.price}
              {"DKK | "}
              {productOrder.quantity * productOrder.product.weight}g (
              {(productOrder.quantity * productOrder.product.weight) / 1000}
              kg)
            </label>
          </div>
        ))}
      </div>
      <p>Total cost: {totalCost}</p>
      <p>Total weight: {totalWeight}</p>
      <button id="submit-button" type="submit" className="double-griditem">
        Add delivery
      </button>
      {err && <p>{err}</p>}
    </form>
  );
}
