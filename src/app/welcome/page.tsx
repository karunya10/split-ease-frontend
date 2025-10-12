"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Please log in to access this page.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="flex justify-between items-center p-6 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-teal-400 rounded"></div>
          <span className="text-xl font-semibold">SplitEase</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">
            Hello, {user.name || user.email}
          </span>
          <Button
            onClick={logout}
            variant="outline"
            className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-slate-900"
          >
            Sign Out
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)] items-center justify-center flex-col">
        <div className="text-center max-w-2xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">Welcome to SplitEase 🎉</h1>
          <p className="text-gray-300 text-xl mb-8">
            You are successfully logged in and ready to manage your shared
            expenses!
          </p>

          <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">
              Hello, {user.name || user.email}!
            </h2>
            <p className="text-lg mb-6">
              Start by creating groups and adding expenses to split with your
              friends.
            </p>
            <Button className="bg-white text-slate-900 hover:bg-gray-100 font-semibold px-8 py-3">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
