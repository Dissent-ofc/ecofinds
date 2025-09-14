import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import Purchases from "./pages/Purchases";

function App(){
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });

  useEffect(() => {
    if(user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Products user={user} />} />
          <Route path="/product/:id" element={<ProductDetail user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/dashboard" element={ user ? <Dashboard user={user} /> : <Navigate to="/login" /> } />
          <Route path="/cart" element={ user ? <Cart user={user} /> : <Navigate to="/login" /> } />
          <Route path="/purchases" element={ user ? <Purchases user={user} /> : <Navigate to="/login" /> } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
