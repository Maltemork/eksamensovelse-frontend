import { useState } from "react";
import { Product } from "../services/types";
import { addProduct } from "../services/apiFacade";
import "./AddProduct.css";

export default function AddProduct() {
  const [err, setErr] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData.entries());

    const product: Product = {
      productId: 0,
      productName: data.name.toString(),
      price: parseFloat(data.price.toString()),
      weight: parseFloat(data.weight.toString()),
    };

    // Clear the form before starting the async operation
    e.currentTarget.reset();

    try {
      await addProduct(product);
      setErr("");
      window.location.href = "/";
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
      <h1 className="double-griditem">Add a new product</h1>
      <label htmlFor="date">Name:</label>
      <input type="text" id="name" name="name" placeholder="Name" required />
      <label htmlFor="price">Price:</label>
      <input
        type="number"
        min="0"
        step=".01"
        id="price"
        name="price"
        placeholder="Price"
        required
      />
      <label htmlFor="weight">Weight:</label>
      <input
        type="number"
        min="0"
        step=".01"
        id="weight"
        name="weight"
        placeholder="Weight"
        required
      />
      <button id="submit-button" type="submit" className="double-griditem">
        Add product
      </button>
      {err && <p>{err}</p>}
    </form>
  );
}
