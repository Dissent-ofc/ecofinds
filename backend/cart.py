from flask import Blueprint, request, jsonify
from utils import read_json, write_json
import os
from datetime import datetime

cart_bp = Blueprint("cart", __name__)
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
CART_FILE = os.path.join(DATA_DIR, "cart.json")
PURCHASES_FILE = os.path.join(DATA_DIR, "purchases.json")
PRODUCTS_FILE = os.path.join(DATA_DIR, "products.json")

def _next_id(items):
    return max([i.get("id", 0) for i in items], default=0) + 1

@cart_bp.route("/cart/<int:user_id>", methods=["GET"])
def get_cart(user_id):
    cart = read_json(CART_FILE)
    items = [c for c in cart if c.get("user_id")==user_id]
    return jsonify(items)

@cart_bp.route("/cart", methods=["POST"])
def add_to_cart():
    payload = request.get_json() or {}
    required = ["user_id", "product_id"]
    if not all(k in payload for k in required):
        return jsonify({"error":"missing fields"}), 400
    cart = read_json(CART_FILE)
    # prevent duplicates (one entry per product per user)
    exists = next((c for c in cart if c["user_id"]==int(payload["user_id"]) and c["product_id"]==int(payload["product_id"])), None)
    if exists:
        return jsonify(exists), 200
    item = {
        "id": _next_id(cart),
        "user_id": int(payload["user_id"]),
        "product_id": int(payload["product_id"]),
        "added_at": datetime.utcnow().isoformat()
    }
    cart.append(item)
    write_json(CART_FILE, cart)
    return jsonify(item), 201

@cart_bp.route("/cart/<int:cart_item_id>", methods=["DELETE"])
def remove_cart_item(cart_item_id):
    cart = read_json(CART_FILE)
    item = next((c for c in cart if c["id"]==cart_item_id), None)
    if not item:
        return jsonify({"error":"not found"}), 404
    cart = [c for c in cart if c["id"]!=cart_item_id]
    write_json(CART_FILE, cart)
    return jsonify({"message":"removed"})

@cart_bp.route("/checkout", methods=["POST"])
def checkout():
    # payload: user_id
    payload = request.get_json() or {}
    user_id = int(payload.get("user_id", 0))
    if not user_id:
        return jsonify({"error":"user_id required"}), 400

    cart = read_json(CART_FILE)
    products = read_json(PRODUCTS_FILE)
    purchases = read_json(PURCHASES_FILE)

    user_items = [c for c in cart if c["user_id"]==user_id]
    if not user_items:
        return jsonify({"error":"cart empty"}), 400

    purchased_products = []
    for c in user_items:
        prod = next((p for p in products if p["id"]==c["product_id"]), None)
        if prod:
            purchased_products.append({
                "product_id": prod["id"],
                "title": prod["title"],
                "price": prod["price"],
                "bought_at": datetime.utcnow().isoformat()
            })

    purchase = {
        "id": _next_id(purchases),
        "user_id": user_id,
        "items": purchased_products,
        "created_at": datetime.utcnow().isoformat()
    }
    purchases.append(purchase)
    # clear user's cart
    cart = [c for c in cart if c["user_id"]!=user_id]
    write_json(PURCHASES_FILE, purchases)
    write_json(CART_FILE, cart)
    return jsonify(purchase), 201

@cart_bp.route("/purchases/<int:user_id>", methods=["GET"])
def get_purchases(user_id):
    purchases = read_json(PURCHASES_FILE)
    user_p = [p for p in purchases if p["user_id"]==user_id]
    return jsonify(user_p)
