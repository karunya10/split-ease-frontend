"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/lib/axiosClient";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isLoginLoading: boolean;
  isSignupLoading: boolean;
  loginError: string | null;
  signupError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Helper function to handle successful authentication
  const handleAuthSuccess = (authData: AuthResponse) => {
    const { token: authToken, user: userData } = authData;

    localStorage.setItem("splitease_token", authToken);
    localStorage.setItem("splitease_user", JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);

    // Set axios default authorization header
    axiosClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${authToken}`;
  };

  // Login mutation
  const loginMutation = useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      const { data } = await axiosClient.post("/auth/login", {
        email,
        password,
      });
      return data;
    },
    onSuccess: handleAuthSuccess,
  });

  // Signup mutation
  const signupMutation = useMutation<AuthResponse, Error, SignupCredentials>({
    mutationFn: async ({ email, password, name }: SignupCredentials) => {
      const payload = name ? { email, password, name } : { email, password };
      const { data } = await axiosClient.post("/auth/signup", payload);
      return data;
    },
    onSuccess: handleAuthSuccess,
  });

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem("splitease_token");
    const storedUser = localStorage.getItem("splitease_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Set axios default authorization header
      axiosClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        }
      );
    });
  };

  const signup = async (email: string, password: string, name?: string) => {
    return new Promise<void>((resolve, reject) => {
      signupMutation.mutate(
        { email, password, name },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        }
      );
    });
  };

  const logout = () => {
    localStorage.removeItem("splitease_token");
    localStorage.removeItem("splitease_user");
    setToken(null);
    setUser(null);
    delete axiosClient.defaults.headers.common["Authorization"];

    // Clear all cached data to prevent showing old user's data
    queryClient.clear();

    // Redirect to home page
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        isLoading,
        isLoginLoading: loginMutation.isPending,
        isSignupLoading: signupMutation.isPending,
        loginError: loginMutation.error?.message || null,
        signupError: signupMutation.error?.message || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
