import React, { useState } from "react";
import { apiPost } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register({ setUser }){
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    const res = await apiPost("/register", { email, username, password });
    if(res.error){ alert(res.error); return; }
    setUser(res);
    nav("/");
  }

  return (
    <div style={{maxWidth:420}}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div className="form-row">
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="form-row">
          <input className="input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        </div>
        <div className="form-row">
          <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button className="button primary" type="submit">Register</button>
      </form>
    </div>
  );
}
