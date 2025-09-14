import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image || "/placeholder.png"} alt={product.title} style={{width:"100%", height:150, objectFit:"cover", borderRadius:6}}/>
        <h3>{product.title}</h3>
      </Link>
      <div className="text-muted">₹{product.price}</div>
      <div className="text-muted small">{product.category}</div>
    </div>
  );
}
