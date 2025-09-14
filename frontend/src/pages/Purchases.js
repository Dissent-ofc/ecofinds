import React, { useEffect, useState } from "react";
import { apiGet } from "../api";

export default function Purchases({ user }){
  const [purchases, setPurchases] = useState([]);

  useEffect(()=>{ fetch(); }, []);

  async function fetch(){
    const res = await apiGet(`/purchases/${user.id}`);
    setPurchases(res || []);
  }

  return (
    <div>
      <h2>Previous Purchases</h2>
      {purchases.length===0 && <div>No purchases yet</div>}
      <div style={{display:"grid", gap:12}}>
        {purchases.map(p => (
          <div key={p.id} className="card">
            <div className="text-muted small">Order #{p.id} — {new Date(p.created_at).toLocaleString()}</div>
            {p.items.map(it => (
              <div key={it.product_id} style={{marginTop:6}}>
                <strong>{it.title}</strong> — ₹{it.price}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
