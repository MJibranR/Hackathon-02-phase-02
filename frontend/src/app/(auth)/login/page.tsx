"use client";

import React, { useEffect, useState } from "react";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden font-sans">

      {/* Floating blobs */}
      {mounted && (
        <>
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 opacity-30 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 opacity-30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        </>
      )}

      {/* Header / Illustration */}
      <header className="flex flex-col items-center justify-center mt-12 relative z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-indigo-600 dark:text-indigo-300 mb-4 animate-bounce"
        >
          <path d="M9 11l3 3L22 4"></path>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
        <h1 className="text-4xl font-bold text-indigo-700 dark:text-indigo-300 mb-6 animate-fade-in-down">
          Login to TODO App
        </h1>
      </header>

      {/* Form */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 sm:px-12 relative z-10">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl animate-fade-in-up">
          <LoginForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center bg-indigo-100 dark:bg-gray-900 relative z-10">
        <p className="text-gray-700 dark:text-gray-300">💓 by Muhammad Jibran Rehan</p>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px,0px) scale(1); }
          33% { transform: translate(30px,-50px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.9); }
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
