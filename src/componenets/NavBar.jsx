import React from "react";
import { Nav } from "react-bootstrap";
import { MdInventory, MdCategory, MdPeople } from "react-icons/md";
import "../styles/sidebar-styles.css";

const NavBar = () => {
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {   
      localStorage.clear(); // Example: remove token from localStorage
      window.location.href = "/"; // Redirect to login page
    }else{
      // User canceled logout, do nothing

    }
  }
  return (
    <aside className="sidebar-container d-flex flex-column vh-100">
      {/* Sidebar Branding Header */}
      <div className="sidebar-brand">
        {/* Full Title on Desktop, Mini Icon or first letters on Mobile */}
        <span className="d-none d-md-block">Inventory Admin</span>
        <span className="d-block d-md-none text-info fw-bold">IA</span>
      </div>

      <Nav className="flex-column flex-grow-1 px-2 px-md-3">
        <Nav.Link href="/viewproducts" className="sidebar-link mb-2">
          <MdInventory className="me-md-2 icon-align" />
          <span className="d-none d-md-inline">Products</span>
        </Nav.Link>

        <Nav.Link href="/addproduct" className="sidebar-link mb-2">
          <MdInventory className="me-md-2 icon-align" />
          <span className="d-none d-md-inline">Add Product</span>
        </Nav.Link>

        <Nav.Link href="/category" className="sidebar-link mb-2">
          <MdCategory className="me-md-2 icon-align" />
          <span className="d-none d-md-inline">Categories</span>
        </Nav.Link>

        {/* create a link for logout */}
        <Nav.Link onClick={handleLogout} className="sidebar-link mb-2">
          <MdPeople className="me-md-2 icon-align" />
          <span className="d-none d-md-inline">Logout</span>
        </Nav.Link>
      </Nav>

      {/* Footer Area */}
      <div className="sidebar-footer p-2 p-md-3 mt-auto border-top text-center text-muted">
        <small className="d-none d-md-block">v1.0.0</small>
        <small className="d-block d-md-none text-secondary">v1</small>
      </div>
    </aside>
  );
};

export default NavBar;
