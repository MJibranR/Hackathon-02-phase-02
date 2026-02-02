"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden font-sans">
      {/* Floating blobs */}
      {mounted && (
        <>
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 opacity-30 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 opacity-30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        </>
      )}

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-8 py-32 text-center relative z-10">
        {/* TODO Illustration */}
        <div className="mb-8 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-indigo-600 dark:text-indigo-300"
          >
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-indigo-700 dark:text-indigo-300 mb-4 animate-fade-in-down">
          Hackathon 02 - TODO App
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-12 max-w-xl animate-fade-in-up">
          Organize your tasks, track progress, and boost productivity. Login to start managing your TODOs.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up">
          <Link href="/login">
            <button className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-600 hover:scale-105 transition transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
              Login
            </button>
          </Link>

          <Link href="/signup">
            <button className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-lg hover:from-green-500 hover:to-green-700 hover:scale-105 transition transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Sign Up
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center bg-indigo-100 dark:bg-gray-800 relative z-10">
        <p className="text-gray-700 dark:text-gray-300">💓 by Muhammad Jibran Rehan</p>
      </footer>

      {/* Tailwind Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }

        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fadeInDown 1s ease forwards; }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 1s ease forwards; }
      `}</style>
    </div>
  );
}