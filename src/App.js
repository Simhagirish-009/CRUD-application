// import logo from "./logo.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavBar from "./componenets/NavBar";
import ProtectedRoute from "./config/ProtectedRoute";
import ProtectedLayout from "./config/ProtectedLayout";
import AddProduct from "./pages/AddProduct";
import Category from "./pages/Category";
import ViewProduct from "./pages/ViewProduct";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/nav" element={<NavBar />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
          
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/category" element={<Category/>}/>
            <Route path="/viewproducts" element={<ViewProduct/>}/>

          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
export default App;