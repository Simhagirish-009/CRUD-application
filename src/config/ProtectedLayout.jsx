import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../componenets/NavBar";
const ProtectedLayout = () => {
  return (
    <div className="d-flex">
      {/* 1. Sidebar stays fixed on the left side of the viewport */}
      <NavBar />

      {/* 2. Main canvas area wraps around any children sub-routes */}
      <main
        className="flex-grow-1 p-4 bg-light"
        style={{ overflowY: "auto", height: "100vh" }}
      >
        {/* The Outlet component will render AddProduct, Home, etc. right here! */}
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
