import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "../api";

export default function Cart({ user }){
  const [items, setItems] = useState([]);
  const [productsMap, setProductsMap] = useState({});

  useEffect(()=>{ fetchCart(); fetchProductsMap(); }, []);

  async function fetchCart(){
    const res = await apiGet(`/cart/${user.id}`);
    setItems(res);
  }

  async function fetchProductsMap(){
    const prods = await apiGet("/products");
    const map = {};
    prods.forEach(p => map[p.id] = p);
    setProductsMap(map);
  }

  async function remove(item){
    await apiDelete(`/cart/${item.id}`);
    fetchCart();
  }

  async function checkout(){
    const res = await apiPost("/checkout", { user_id: user.id });
    if(res.error){ alert(res.error); return; }
    alert("Purchase successful");
    fetchCart();
  }

  return (
    <div>
      <h2>Your Cart</h2>
      {items.length === 0 && <div>No items in cart</div>}
      <div style={{display:"grid", gap:12}}>
        {items.map(it => {
          const p = productsMap[it.product_id];
          if(!p) return null;
          return (
            <div key={it.id} className="card" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div>
                <strong>{p.title}</strong>
                <div className="text-muted">₹{p.price}</div>
              </div>
              <div style={{display:"flex", gap:8}}>
                <button className="button" onClick={()=>remove(it)}>Remove</button>
              </div>
            </div>
          );
        })}
      </div>
      {items.length > 0 && <div style={{marginTop:12}}>
        <button className="button primary" onClick={checkout}>Checkout</button>
      </div>}
    </div>
  );
}
