import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }){
  const nav = useNavigate();
  function logout(){
    setUser(null);
    nav("/login");
  }
  return (
    <div className="header">
      <div>
        <Link to="/"><strong>EcoFinds</strong></Link>
      </div>
      <div className="nav">
        <Link to="/">Marketplace</Link>
        {user && <Link to="/dashboard">My Dashboard</Link>}
        <Link to="/purchases">Previous Purchases</Link>
        <Link to="/cart">Cart</Link>
        {user ? (
          <>
            <span className="small text-muted">Hello, {user.username || user.email}</span>
            <button className="button" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
