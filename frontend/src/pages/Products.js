import React, { useEffect, useState } from "react";
import { apiGet } from "../api";
import ProductCard from "../components/ProductCard";

export default function Products(){
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts(){
    let url = "/products";
    const params = [];
    if(q) params.push(`q=${encodeURIComponent(q)}`);
    if(category) params.push(`category=${encodeURIComponent(category)}`);
    if(params.length) url += "?" + params.join("&");
    const data = await apiGet(url);
    setProducts(data);
  }

  function onSearch(e){
    e.preventDefault();
    fetchProducts();
  }

  return (
    <>
      <h2>Marketplace</h2>
      <form onSubmit={onSearch} style={{display:"flex", gap:8, marginBottom:12}}>
        <input className="input" placeholder="Search title..." value={q} onChange={e=>setQ(e.target.value)} />
        <input className="input" placeholder="Filter category..." value={category} onChange={e=>setCategory(e.target.value)} />
        <button className="button" onClick={onSearch}>Search</button>
      </form>

      <div className="grid">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
