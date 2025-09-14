import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../api";

export default function ProductDetail({ user }){
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    apiGet(`/products/${id}`).then(setProduct);
  }, [id]);

  async function addToCart(){
    if(!user) { nav("/login"); return; }
    await apiPost("/cart", { user_id: user.id, product_id: product.id });
    alert("Added to cart");
  }

  if(!product) return <div>Loading...</div>;
  return (
    <div>
      <div style={{display:"flex", gap:20}}>
        <img src={product.image || "/placeholder.png"} alt={product.title} style={{width:300, height:300, objectFit:"cover", borderRadius:8}}/>
        <div>
          <h2>{product.title}</h2>
          <div className="text-muted">₹{product.price}</div>
          <div className="text-muted small">{product.category}</div>
          <p>{product.description}</p>
          <button className="button primary" onClick={addToCart}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}
