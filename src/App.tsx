import "./App.css";
import ProductPage from "./components/ProductPage";
import AddProduct from "./components/AddProduct";
import AddDelivery from "./components/AddDelivery";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./Layout";
import DeliveriesPage from "./components/DeliveriesPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ProductPage />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/deliveries" element={<DeliveriesPage />} />
          <Route path="/add-delivery" element={<AddDelivery />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
