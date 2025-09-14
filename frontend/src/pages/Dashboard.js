import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete, apiPut } from "../api";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";

export default function Dashboard({ user }){
  const [myProducts, setMyProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchMyProducts(); }, []);

  async function fetchMyProducts(){
    const all = await apiGet("/products");
    setMyProducts(all.filter(p => p.owner_id === user.id));
  }

  async function createProduct(payload){
    payload.owner_id = user.id;
    const res = await apiPost("/products", payload);
    if(res.error) { alert(res.error); return; }
    fetchMyProducts();
    setShowForm(false);
  }

  async function editProduct(payload){
    const res = await apiPut(`/products/${editing.id}`, { ...payload, owner_id: user.id });
    if(res.error){ alert(res.error); return;}
    setEditing(null);
    fetchMyProducts();
  }

  async function deleteProduct(p){
    if(!confirm("Delete product?")) return;
    const res = await apiDelete(`/products/${p.id}`, { owner_id: user.id });
    if(res.error){ alert(res.error); return; }
    fetchMyProducts();
  }

  return (
    <div>
      <h2>My Dashboard</h2>
      <div style={{marginBottom:12}}>
        <button className="button primary" onClick={()=>{ setShowForm(!showForm); setEditing(null); }}>
          + Add New Product
        </button>
      </div>

      {showForm && <div style={{marginBottom:12}}><ProductForm onSubmit={createProduct} /></div>}

      {editing && (
        <div style={{marginBottom:12}}>
          <h3>Edit Product</h3>
          <ProductForm initial={editing} onSubmit={editProduct} />
        </div>
      )}

      <h3>My Listings</h3>
      <div className="grid">
        {myProducts.map(p => (
          <div key={p.id} className="card">
            <ProductCard product={p} />
            <div style={{display:"flex", gap:8, marginTop:8}}>
              <button className="button" onClick={()=>{ setEditing(p); window.scrollTo(0,0); }}>Edit</button>
              <button className="button" onClick={()=>deleteProduct(p)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
