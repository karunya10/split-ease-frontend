"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import FeatureGrid from "./(home)/components/FeatureGrid";
import AuthForms from "./(home)/components/AuthForms";

export default function Home() {
  const { user, login, signup, isLoading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

 
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header isAuthenticated={false} />

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-teal-400 rounded flex items-center justify-center">
              <span className="text-slate-900 font-bold">👥</span>
            </div>
            <h1 className="text-5xl font-bold">Welcome to SplitEase</h1>
          </div>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Track shared expenses, settle up with friends, and keep group chats
            in one place. Designed for students and young professionals.
          </p>
        </div>

        <FeatureGrid />
        <AuthForms onSignup={signup} onLogin={login} />
      </div>
    </div>
  );
}
