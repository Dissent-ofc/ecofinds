const API_URL = "http://127.0.0.1:5000";

export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`);
  return res.json();
}

export async function apiPost(path, data) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function apiPut(path, data) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function apiDelete(path, data) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data || {})
  });
  return res.json();
}
