"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "./(home)/components/Hero";
import FeatureGrid from "./(home)/components/FeatureGrid";
import AuthForms from "./(home)/components/AuthForms";

export default function Home() {
  const { user, login, signup, isLoading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If user is authenticated, they will be redirected, but show loading state
  if (user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  // If not authenticated, show landing page with auth forms
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header isAuthenticated={false} />

      <div className="container mx-auto px-6 py-20">
        <Hero />
        <FeatureGrid />
        <AuthForms
          onSignup={signup}
          onLogin={login}
         
        />
      </div>
    </div>
  );
}
