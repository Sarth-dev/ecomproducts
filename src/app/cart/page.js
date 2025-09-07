"use client";
import { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // Update to your backend URL
});

// Set JWT token from localStorage for authenticated requests
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

function CartItem({ initialItem, onRemove, onQtyChange }) {
  const [item, setItem] = useState(initialItem);

  const changeQty = (newQty) => {
    if (newQty < 1) return;
    setItem({ ...item, qty: newQty });
    onQtyChange(item._id || item.id, newQty);
  };

  const remove = () => {
    onRemove(item._id || item.id);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border rounded-lg p-4 shadow-md bg-white w-full max-w-3xl">
      <img
        src={item.image} alt={item.title}
        className="w-full sm:w-24 h-48 sm:h-24 object-contain rounded-lg border"
      />
      <div className="flex-1 w-full">
        <h4 className="font-semibold text-lg text-gray-900">{item.title}</h4>
        <p className="text-gray-500 text-sm mt-1">{item.category}</p>
        <p className="font-bold text-xl text-gray-800 mt-2">₹{item.price}</p>
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <button
            className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            onClick={() => changeQty(item.qty - 1)}
            disabled={item.qty === 1}
            aria-label="Decrease quantity"
          >−</button>
          <span className="text-lg text-gray-800 font-medium">{item.qty}</span>
          <button
            className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            onClick={() => changeQty(item.qty + 1)}
            aria-label="Increase quantity"
          >+</button>
          <button
            className="ml-auto sm:ml-6 text-red-600 font-semibold hover:underline"
            onClick={remove}
            aria-label="Remove item"
          >Remove</button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items from backend API
  const fetchCartItems = async () => {
    try {
      const res = await api.get("/cart");
      // Backend returns cart items with product embedded or product IDs — adjust as needed
      // Here assume each cart item: { product: {...}, qty }
      setCartItems(
        res.data.map((c) => ({
          ...(c.product || c), // for backward compatibility
          qty: c.qty || 1,
        }))
      );
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Remove item API call
  const removeFromCart = async (id) => {
    try {
      await api.post("/cart/remove", { productId: id });
      await fetchCartItems();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // Change quantity API call
  const changeQty = async (id, qty) => {
    try {
      await api.post("/cart/update", { productId: id, qty });
      await fetchCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <>
      <Navbar />
      <main className="p-6 sm:p-8 bg-gray-50 min-h-screen flex flex-col items-center justify-start gap-8">
        <h1 className="text-3xl text-gray-900 font-bold">Cart Items</h1>

        {cartItems.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          cartItems.map((product) => (
            <CartItem
              key={product._id || product.id}
              initialItem={product}
              onRemove={removeFromCart}
              onQtyChange={changeQty}
            />
          ))
        )}
      </main>
    </>
  );
}
