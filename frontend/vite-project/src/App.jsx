import React from "react";
import "./App.css";
import { UserProvider } from "./hooks/UserContext";
import { CartProvider } from "./hooks/CartContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart";

function App() {
  return (
    <>
      <Router>
        <UserProvider>
          <CartProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </CartProvider>
        </UserProvider>
      </Router>
    </>
  );
}

export default App;
