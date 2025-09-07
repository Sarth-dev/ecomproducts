/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../component/Navbar";
import axios from "axios";

const api = axios.create({
  baseURL: "https://ecomproductbackend.onrender.com/", // Update with your backend API URL
});

export default function ListingPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [cart, setCart] = useState([]);
  const [viewCart, setViewCart] = useState(false);

  const categories = ["Shoes", "Accessories", "Electronics", "Clothing"];

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // redirect to login page
      return;
    }
    // Set token header for API calls
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setLoggedIn(true);
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    if (!loggedIn) return;

    async function fetchProducts() {
      try {
        const params = {};
        if (selectedCategories.length === 1) params.category = selectedCategories[0];
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        const res = await api.get("/products", { params });
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    }

    fetchProducts();
  }, [loggedIn, selectedCategories, minPrice, maxPrice]);

  
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };


  const addToCart = async (product) => {
    try {
      await api.post("/cart/add", { productId: product._id || product.id, qty: 1 });
      await fetchCart();
      setViewCart(true);
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  
  const removeFromCart = async (productId) => {
    try {
      await api.post("/cart/remove", { productId });
      await fetchCart();
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

  const updateQty = async (productId, qty) => {
    if (qty < 1) return;
    try {
      await api.post("/cart/update", { productId, qty });
      await fetchCart();
    } catch (err) {
      console.error("Update quantity failed:", err);
    }
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [cat]
    );
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="flex justify-center items-center min-h-screen">
          <p>Loading...</p>
        </main>
      </>
    );
  }

  
  if (!loggedIn) {
    return null;
  }

  if (viewCart) {
    return (
      <>
        <Navbar />
        <main className="p-8 bg-gray-50 min-h-screen max-w-6xl mx-auto">
          <button
            onClick={() => setViewCart(false)}
            className="mb-6 text-blue-600 hover:underline"
          >
            &larr; Back to listing
          </button>
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          {cart.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <div className="space-y-4">
              {cart.map(({ product, qty }) => (
                <div
                  key={product._id}
                  className="flex items-center gap-6 border rounded-lg p-4 shadow-md bg-white"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-24 h-24 object-contain rounded-lg border"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-900">{product.title}</h4>
                    <p className="text-gray-500 text-sm mt-1">{product.category}</p>
                    <p className="font-bold text-xl text-gray-800 mt-2">
                      ₹{product.price} &times; {qty} = ₹{product.price * qty}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <button
                        className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        onClick={() => updateQty(product._id, qty - 1)}
                        disabled={qty === 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="text-lg text-gray-800 font-medium">{qty}</span>
                      <button
                        className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        onClick={() => updateQty(product._id, qty + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        className="ml-6 text-red-600 font-semibold hover:underline"
                        onClick={() => removeFromCart(product._id)}
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-8 text-gray-900 max-w-full mx-auto bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Product Listing</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters */}
          <div className="md:w-1/4 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>

            <div className="mb-6">
              <p className="block mb-2 font-medium">Category</p>
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="inline-flex items-center mr-4 mb-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    className="form-radio h-5 w-5 text-blue-600"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  <span className="ml-2 text-gray-700">{cat}</span>
                </label>
              ))}
            </div>

            <div>
              <p className="block mb-2 font-medium">Price Range (₹)</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 px-3 py-2 border rounded"
                  min={0}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 px-3 py-2 border rounded"
                  min={0}
                />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <p className="text-gray-500 col-span-full">No products found.</p>
            ) : (
              products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-40 object-contain mb-4 rounded"
                  />
                  <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  <p className="font-bold text-xl mb-4">₹{product.price}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
