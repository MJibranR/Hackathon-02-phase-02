"use client";

import React from "react";
import { useAuth } from "@/lib/auth_context";
import Link from "next/link";

const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="relative z-20 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-md">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6 md:px-0">
        {/* Logo */}
        <Link href="/" className="text-2xl md:text-3xl font-extrabold tracking-wide text-indigo-700 dark:text-indigo-300 hover:scale-105 transition-transform">
          Hackathon TODO
        </Link>

        {/* Auth Buttons */}
        {isAuthenticated && user ? (
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="hidden sm:inline text-lg md:text-xl text-gray-700 dark:text-gray-300">Welcome, {user.name}!</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-red-500 text-white font-semibold shadow-lg hover:bg-red-600 hover:scale-105 transition transform"
            >
              {/* Logout Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 002 2h3a2 2 0 002-2V7a2 2 0 00-2-2h-3a2 2 0 00-2 2v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/login">
              <button className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-600 hover:scale-105 transition transform">
                {/* Login Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
                <span className="hidden sm:inline">Login</span>
              </button>
            </Link>
            <Link href="/signup">
              <button className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-lg hover:from-green-500 hover:to-green-700 hover:scale-105 transition transform">
                {/* Sign Up Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Sign Up</span>
              </button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
