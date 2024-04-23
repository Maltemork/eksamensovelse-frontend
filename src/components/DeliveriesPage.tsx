import { useEffect, useState } from "react";
import {
  getDeliveries,
  removeDelivery,
  editDelivery,
} from "../services/apiFacade";
import "./DeliveriesPage.css";
import { NavLink } from "react-router-dom";
import { ProductOrder } from "../services/types";

export default function DeliveryPage() {
  interface Delivery {
    deliveryId: number;
    deliveryDate: Date;
    destination: string;
    fromWarehouse: string;
    productOrders: Array<ProductOrder>;
    [key: string]: string | number | Date | Array<ProductOrder>;
  }
  const [deliveries, setDeliveries] = useState<Array<Delivery>>([]);
  const [error, setError] = useState("");

  // Sort table
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [clickCount, setClickCount] = useState(0);

  // Filter table
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDeliveries = deliveries.filter((delivery) =>
    Object.values(delivery).some(
      // Filter by search term
      (value) =>
        (typeof value === "string" || typeof value === "number") &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedDeliveries = [...filteredDeliveries].sort((a, b) => {
    if (!sortField) return 0;

    if ((a[sortField] as string) < (b[sortField] as string))
      return sortDirection === "asc" ? -1 : 1;
    if ((a[sortField] as string) > (b[sortField] as string))
      return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Fetch data
  useEffect(() => {
    getDeliveries()
      .then((res) => setDeliveries(res))
      .catch(() => setError("Error fetching users, is the server running?"));
  }, [deliveries]);

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

  const handleDeleteClicked = (delivery: Delivery) => async () => {
    // show confirmation
    if (
      !window.confirm(
        "Are you sure you want to delete this delivery? This will also remove product orders made for this delivery." +
          delivery.deliveryId +
          ",  " +
          delivery.deliveryDate +
          ", destination " +
          delivery.destination +
          ", from warehouse " +
          delivery.fromWarehouse +
          "?"
      )
    ) {
      return;
    }

    await removeDelivery(delivery as Delivery);
    setDeliveries(deliveries.filter((p) => p !== delivery));
  };

  const handleEditClicked = (delivery: Delivery) => async () => {
    // Populate the form with the delivery's data
    const dialog = document.getElementById(
      "edit-delivery-dialog"
    ) as HTMLDialogElement;
    const form = document.getElementById(
      "edit-delivery-form"
    ) as HTMLFormElement;
    const date = form.elements.namedItem("date") as HTMLInputElement;
    const destination = form.elements.namedItem(
      "destination"
    ) as HTMLInputElement;
    const fromWarehouse = form.elements.namedItem(
      "fromWarehouse"
    ) as HTMLInputElement;
    date.value = delivery.deliveryDate.toString();
    destination.value = delivery.destination.toString();
    fromWarehouse.value = delivery.fromWarehouse.toString();
    dialog.showModal();
    dialog.addEventListener("close", () => {
      // Clear the form when the dialog is closed
      form.reset();
    });
    form.onsubmit = (event) => {
      handleEditSubmit(
        event as unknown as React.FormEvent<HTMLFormElement>,
        delivery
      );
      dialog.close();
    };
  };

  const deliveryItems = sortedDeliveries.map((delivery, index) => (
    <tr key={index} className="table-item">
      <td>{delivery.deliveryId}</td>
      <td>
        {new Date(delivery.deliveryDate).getDate()} /{" "}
        {new Date(delivery.deliveryDate).getMonth()} /{" "}
        {new Date(delivery.deliveryDate).getFullYear()}
      </td>
      <td>{delivery.destination}</td>
      <td>{delivery.fromWarehouse}</td>
      <td>
        <button onClick={handleDeleteClicked(delivery)}>🗑️</button>
      </td>
      <td>
        <button onClick={handleEditClicked(delivery)}>✏️</button>
      </td>
    </tr>
  ));

  const handleEditSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    oldDelivery: Delivery
  ) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const deliveryDate = form.elements.namedItem("date") as HTMLInputElement;
    const destination = form.elements.namedItem(
      "destination"
    ) as HTMLInputElement;
    const fromWarehouse = form.elements.namedItem(
      "fromWarehouse"
    ) as HTMLInputElement;
    const newDelivery = {
      deliveryId: oldDelivery.deliveryId,
      deliveryDate: new Date(deliveryDate.value),
      destination: destination.value,
      fromWarehouse: fromWarehouse.value,
      productOrders: oldDelivery.productOrders,
    };
    editDelivery(newDelivery);
    setDeliveries(
      deliveries.map((p) => (p === deliveries[0] ? newDelivery : p))
    );
  };

  return (
    <>
      <div>
        <h1>All Deliveries</h1>

        <input
          id="searchField"
          type="search"
          placeholder="Search..."
          onChange={handleSearchChange}
        />
        <button id="add-delivery-button">
          <NavLink to="/add-delivery">Add Delivery</NavLink>
        </button>
        <table id="deliveryTable">
          <thead id="tableHead">
            <tr>
              <th onClick={handleHeaderClick("deliveryId")}>#</th>
              <th onClick={handleHeaderClick("deliveryDate")}>Delivery Date</th>
              <th onClick={handleHeaderClick("destination")}>Destination</th>
              <th onClick={handleHeaderClick("fromWarehouse")}>Warehouse</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>{deliveryItems}</tbody>
        </table>
        {error && <p>{error}</p>}
      </div>
      <dialog id="edit-delivery-dialog">
        <form id="edit-delivery-form">
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
            Edit delivery
          </button>
        </form>
        {error && <p>{error}</p>}
      </dialog>
    </>
  );
}
