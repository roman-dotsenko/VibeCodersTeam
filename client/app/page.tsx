'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, User } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    authService.checkAuth()
      .then((userData) => {
        setUser(userData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
      </div>
    );
  }

  if (user) {
    // User is logged in, show welcome message
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <main className="text-center">
          <div className="mb-6">
            {user.picture && (
              <img
                src={user.picture}
                alt="Profile"
                className="mx-auto h-24 w-24 rounded-full border-4 border-white shadow-lg"
              />
            )}
          </div>
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome back, {user.name}!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Your personal job application assistant
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/user-dashboard"
              className="inline-block rounded-lg bg-indigo-600 px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="inline-block rounded-lg bg-gray-600 px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </main>
      </div>
    );
  }

  // User is not logged in
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          JobHelper
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Your personal job application assistant
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-indigo-600 px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Get Started
        </Link>
      </main>
    </div>
  );
}
