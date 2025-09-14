import React, { useState } from "react";

export default function ProductForm({ onSubmit, initial={} }) {
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [category, setCategory] = useState(initial.category || "");
  const [price, setPrice] = useState(initial.price || "");
  const [image, setImage] = useState(initial.image || "");

  function submit(e){
    e.preventDefault();
    onSubmit({ title, description, category, price, image });
  }

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
      </div>
      <div className="form-row">
        <input className="input" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} required />
      </div>
      <div className="form-row">
        <textarea className="input" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} required />
      </div>
      <div className="form-row">
        <input className="input" placeholder="Price" type="number" value={price} onChange={e=>setPrice(e.target.value)} required />
      </div>
      <div className="form-row">
        <input className="input" placeholder="Image URL (optional)" value={image} onChange={e=>setImage(e.target.value)} />
      </div>
      <button className="button primary" type="submit">Save</button>
    </form>
  );
}
