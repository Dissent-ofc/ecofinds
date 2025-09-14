import React, { useState } from "react";
import { apiPost } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    const res = await apiPost("/login", { email, password });
    if(res.error){ alert(res.error); return; }
    setUser(res);
    nav("/");
  }

  return (
    <div style={{maxWidth:420}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div className="form-row">
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="form-row">
          <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button className="button primary" type="submit">Login</button>
      </form>
    </div>
  );
}
