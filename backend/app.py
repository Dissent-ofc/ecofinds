from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from auth import auth_bp
from products import products_bp
from cart import cart_bp

app = Flask(__name__, static_folder=None)
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(products_bp)
app.register_blueprint(cart_bp)

# simple placeholder image route (serve from backend folder)
@app.route("/placeholder.png")
def placeholder():
    return send_from_directory(os.path.join(os.path.dirname(__file__), "static"), "placeholder.png")

if __name__ == "__main__":
    # ensure data folder exists
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    app.run(debug=True)
