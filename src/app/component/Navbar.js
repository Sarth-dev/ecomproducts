"use client";
import React, { useState } from "react";
import Link from "next/link";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md -mb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <span className="font-bold text-xl text-blue-600 cursor-pointer">
              E-Commerce Shop
            </span>
          </Link>

          <div className="hidden md:flex gap-6 text-gray-800">
            <Link href="/cart" className="hover:text-blue-500">
              Cart
            </Link>
            <Link href="/allproducts" className="hover:text-blue-500">
              Products
            </Link>
            <Link href="/login" className="hover:text-blue-500">
              Login
            </Link>
            <Link href="/signup" className="hover:text-blue-500">
              Signup
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-800 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-gray-800">
            <Link href="/cart" className="block px-3 py-2 rounded-md hover:text-blue-500">
              Cart
            </Link>
            <Link href="/allproducts" className="block px-3 py-2 rounded-md hover:text-blue-500">
              Products
            </Link>
            <Link href="/login" className="block px-3 py-2 rounded-md hover:text-blue-500">
              Login
            </Link>
            <Link href="/signup" className="block px-3 py-2 rounded-md hover:text-blue-500">
              Signup
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
