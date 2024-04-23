import { useEffect, useState } from "react";
import { getProducts, removeProduct, editProduct } from "../services/apiFacade";
import "./ProductPage.css";
import { NavLink } from "react-router-dom";

export default function ProductPage() {
  interface Product {
    productId: number;
    productName: string;
    price: number;
    weight: number;
  }
  // Import the Product type from the appropriate location
  const [products, setProducts] = useState<Array<Product>>([]);
  const [error, setError] = useState("");

  // Sort table
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [clickCount, setClickCount] = useState(0);

  // Filter table
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    Object.values(product).some(
      // Filter by search term
      (value) =>
        (typeof value === "string" || typeof value === "number") &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField) return 0;

    if ((a[sortField] as string) < (b[sortField] as string))
      return sortDirection === "asc" ? -1 : 1;
    if ((a[sortField] as string) > (b[sortField] as string))
      return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  interface Product {
    [key: string]: string | number;
  }

  // Fetch data
  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res))
      .catch(() => setError("Error fetching users, is the server running?"));
  }, [products]);

  const handleHeaderClick = (field: string) => () => {
    if (sortField === field) {
      if (clickCount === 2) {
        // If the field has been clicked three times in a row, remove sorting
        setSortField(null);
        setClickCount(0);
      } else {
        // If the field has been clicked twice in a row, reverse the direction
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        setClickCount(clickCount + 1);
      }
    } else {
      // If a new field is clicked, sort by that field in ascending order
      setSortField(field);
      setSortDirection("asc");
      setClickCount(1);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteClicked = (product: Product) => async () => {
    // show confirmation
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This will also remove product orders made for this product." +
          product.productId +
          " " +
          product.productName +
          " " +
          product.price +
          " " +
          product.weight +
          "?"
      )
    ) {
      return;
    }

    await removeProduct(product as Product);
    setProducts(products.filter((p) => p !== product));
  };

  const handleEditClicked = (product: Product) => async () => {
    // Populate the form with the product's data
    const dialog = document.getElementById(
      "edit-product-dialog"
    ) as HTMLDialogElement;
    const form = document.getElementById(
      "edit-product-form"
    ) as HTMLFormElement;
    const name = form.elements.namedItem("name") as HTMLInputElement;
    const price = form.elements.namedItem("price") as HTMLInputElement;
    const weight = form.elements.namedItem("weight") as HTMLInputElement;
    name.value = product.productName as string;
    price.value = product.price.toString();
    weight.value = product.weight.toString();
    dialog.showModal();
    dialog.addEventListener("close", () => {
      // Clear the form when the dialog is closed
      form.reset();
    });
    form.onsubmit = (event) => {
      handleEditSubmit(
        event as unknown as React.FormEvent<HTMLFormElement>,
        product
      );
      dialog.close();
    };
  };

  const productItems = sortedProducts.map((product, index) => (
    <tr key={index} className="table-item">
      <td>{product.productId}</td>
      <td>{product.productName}</td>
      <td>{product.price}</td>
      <td>{product.weight}</td>
      <td>
        <button onClick={handleDeleteClicked(product)}>🗑️</button>
      </td>
      <td>
        <button onClick={handleEditClicked(product)}>✏️</button>
      </td>
    </tr>
  ));

  const handleEditSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    oldProduct: Product
  ) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const name = form.elements.namedItem("name") as HTMLInputElement;
    const price = form.elements.namedItem("price") as HTMLInputElement;
    const weight = form.elements.namedItem("weight") as HTMLInputElement;
    const newProduct = {
      productId: oldProduct.productId,
      productName: name.value,
      price: parseFloat(price.value),
      weight: parseFloat(weight.value),
    };
    editProduct(newProduct);
    setProducts(products.map((p) => (p === products[0] ? newProduct : p)));
  };

  return (
    <>
      <div>
        <h1>All Products</h1>

        <input
          id="searchField"
          type="search"
          placeholder="Search..."
          onChange={handleSearchChange}
        />
        <button id="add-product-button">
          <NavLink to="/add-product">Add Product</NavLink>
        </button>
        <table id="productTable">
          <thead id="tableHead">
            <tr>
              <th onClick={handleHeaderClick("productId")}>#</th>
              <th onClick={handleHeaderClick("productName")}>Product Name</th>
              <th onClick={handleHeaderClick("price")}>Price</th>
              <th onClick={handleHeaderClick("weight")}>Weight</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>{productItems}</tbody>
        </table>
        {error && <p>{error}</p>}
      </div>
      <dialog id="edit-product-dialog">
        <form id="edit-product-form">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            required
          />
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
          <button id="submit-button" type="submit">
            Edit product
          </button>
        </form>
        {error && <p>{error}</p>}
      </dialog>
    </>
  );
}
