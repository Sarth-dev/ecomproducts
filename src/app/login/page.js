/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const api = axios.create({
  baseURL: "https://ecomproductbackend.onrender.com/api", // Update to backend URL
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
       
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        
        router.push("/");
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto text-center mt-20 text-gray-900 bg-white p-8 shadow rounded">
      <h2 className="text-2xl text-center font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-3 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 px-3 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMsg && (
          <p className="text-red-600 mb-3 text-center font-semibold">{errorMsg}</p>
        )}
        <button
          type="submit"
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        <Link className="text-center mt-5" href='/signup'>don't have an account! <span className="text-blue-700">Signup</span></Link>
      </form>
    </div>
  );
}
