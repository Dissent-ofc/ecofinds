from flask import Blueprint, request, jsonify
from utils import read_json, write_json
import os

products_bp = Blueprint("products", __name__)
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
PRODUCTS_FILE = os.path.join(DATA_DIR, "products.json")

def _next_id(items):
    return max([i.get("id", 0) for i in items], default=0) + 1

@products_bp.route("/products", methods=["GET"])
def list_products():
    # support optional query params: q (keyword), category
    q = (request.args.get("q") or "").strip().lower()
    category = (request.args.get("category") or "").strip().lower()
    products = read_json(PRODUCTS_FILE)
    filtered = products
    if category:
        filtered = [p for p in filtered if p.get("category","").lower() == category]
    if q:
        filtered = [p for p in filtered if q in p.get("title","").lower()]
    return jsonify(filtered)

@products_bp.route("/products/<int:pid>", methods=["GET"])
def get_product(pid):
    products = read_json(PRODUCTS_FILE)
    prod = next((p for p in products if p["id"] == pid), None)
    if not prod:
        return jsonify({"error": "not found"}), 404
    return jsonify(prod)

@products_bp.route("/products", methods=["POST"])
def add_product():
    payload = request.get_json() or {}
    required = ["title", "description", "category", "price", "owner_id"]
    if not all(k in payload for k in required):
        return jsonify({"error": "missing fields"}), 400

    products = read_json(PRODUCTS_FILE)
    new = {
        "id": _next_id(products),
        "title": payload["title"],
        "description": payload["description"],
        "category": payload["category"],
        "price": float(payload["price"]),
        "image": payload.get("image", "/placeholder.png"),
        "owner_id": int(payload["owner_id"])
    }
    products.append(new)
    write_json(PRODUCTS_FILE, products)
    return jsonify(new), 201

@products_bp.route("/products/<int:pid>", methods=["PUT"])
def edit_product(pid):
    payload = request.get_json() or {}
    products = read_json(PRODUCTS_FILE)
    idx = next((i for i,p in enumerate(products) if p["id"] == pid), None)
    if idx is None:
        return jsonify({"error":"not found"}), 404
    # optionally require owner_id match (frontend should send owner_id)
    if "owner_id" in payload and int(payload["owner_id"]) != int(products[idx]["owner_id"]):
        return jsonify({"error":"forbidden"}), 403
    # update fields
    for key in ("title","description","category","price","image"):
        if key in payload:
            products[idx][key] = payload[key] if key!="price" else float(payload[key])
    write_json(PRODUCTS_FILE, products)
    return jsonify(products[idx])

@products_bp.route("/products/<int:pid>", methods=["DELETE"])
def delete_product(pid):
    payload = request.get_json() or {}
    owner_id = payload.get("owner_id")
    products = read_json(PRODUCTS_FILE)
    prod = next((p for p in products if p["id"] == pid), None)
    if not prod:
        return jsonify({"error":"not found"}), 404
    if owner_id is None or int(owner_id) != int(prod["owner_id"]):
        return jsonify({"error":"forbidden"}), 403
    products = [p for p in products if p["id"] != pid]
    write_json(PRODUCTS_FILE, products)
    return jsonify({"message":"deleted"})
