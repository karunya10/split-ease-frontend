"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "./(home)/components/Hero";
import FeatureGrid from "./(home)/components/FeatureGrid";
import AuthForms from "./(home)/components/AuthForms";

export default function Home() {
  const {
    user,
    login,
    signup,
    isLoading,
    isLoginLoading,
    isSignupLoading,
    loginError,
    signupError,
  } = useAuth();

  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard"); // Change this to your desired route
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
          isLoginLoading={isLoginLoading}
          isSignupLoading={isSignupLoading}
          loginError={loginError}
          signupError={signupError}
        />
      </div>
    </div>
  );
}
