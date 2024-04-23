import { NavLink, useLocation } from "react-router-dom";
import "./NavHeader.css";

export default function NavHeader() {
  const location = useLocation();

  return (
    <nav className="nav-header">
      <ul className="nav-header-ul">
        <h1>købmandsapp.io</h1>
        <li
          id="nav-product-page"
          className={location.pathname === "/" ? "active" : ""}
        >
          <NavLink to="/">Products</NavLink>
        </li>
        <li
          id="nav-deliveries"
          className={location.pathname === "/deliveries" ? "active" : ""}
        >
          <NavLink to="/deliveries">Deliveries</NavLink>
        </li>
        <li
          id="nav-vans"
          className={location.pathname === "/vans" ? "active" : ""}
        >
          <NavLink to="/vans">Vans</NavLink>
        </li>
      </ul>
    </nav>
  );
}
