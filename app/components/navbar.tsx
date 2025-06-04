"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/chat" className="hover:text-gray-300">Chat</Link>
          <Link href="/support" className="hover:text-gray-300">Support</Link>
          <Link href="/about" className="hover:text-gray-300">About</Link>
        </div>

        <div className="relative">
          {isLoggedIn ? (
            <>
              <div className="flex items-center space-x-4">
                <span className="mr-2">Welcome</span>

                {/* User Pages Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
                  >
                    User Pages
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 bg-white text-gray-800 shadow-lg rounded w-40 z-10">
                      <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                      <Link href="/diary" className="block px-4 py-2 hover:bg-gray-100">Diary</Link>
                      <Link href="/meditation" className="block px-4 py-2 hover:bg-gray-100">Meditation</Link>
                      <Link href="/quotes" className="block px-4 py-2 hover:bg-gray-100">Quotes</Link>
                    </div>
                  )}
                </div>

                <button
                  onClick={logout}
                  className="ml-4 bg-red-500 px-4 py-2 rounded hover:bg-red-400"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="space-x-4">
              <Link href="/login" className="hover:text-gray-300">Login</Link>
              <Link href="/signup" className="hover:text-gray-300">Signup</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
