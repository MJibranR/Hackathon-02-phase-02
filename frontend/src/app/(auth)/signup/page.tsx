"use client";

import SignupForm from '@/components/SignupForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden font-sans">

      {/* Floating background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 opacity-30 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 opacity-30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-8 py-32 text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-indigo-700 dark:text-indigo-300 mb-4 animate-fade-in-down">
          Hackathon 02 - TODO App
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-12 max-w-xl animate-fade-in-up">
          Join us to manage your tasks, track progress, and increase productivity.
        </p>

        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl animate-fade-in-up">
          <SignupForm />
        </div>

        <p className="mt-6 text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-400 font-semibold">
            Log in
          </Link>
        </p>
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
