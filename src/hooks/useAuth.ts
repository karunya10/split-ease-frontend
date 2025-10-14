import { useState, useEffect } from "react";
import {
  useSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from "next-auth/react";
import api from "@/lib/api";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface UseAuthReturn {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  googleSignIn: () => Promise<void>;
  isLoading: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkAuth = async () => {
      // If user is authenticated via NextAuth (Google), use the backend token
      if (session?.backendToken && session?.backendUser) {
        localStorage.setItem("splitease_token", session.backendToken);
        setUser(session.backendUser);
        setIsLoading(false);
        return;
      }

      // Otherwise, verify using existing token
      await verify();
      setIsLoading(false);
    };

    if (status !== "loading") {
      checkAuth();
    }
  }, [session, status]);

  const login = async (email: string, password: string) => {
    try {
      const { data: authData } = await api.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("splitease_token", authData.token);
      setUser(authData.user);
    } catch (error) {
      console.log(error);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      const payload = name ? { email, password, name } : { email, password };
      const { data: authData } = await api.post("/auth/signup", payload);
      localStorage.setItem("splitease_token", authData.token);
      setUser(authData.user);
    } catch (error) {
      console.log(error);
    }
  };

  const verify = async () => {
    try {
      const { data: authData } = await api.get("/auth/verify");
      setUser(authData.user);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    localStorage.removeItem("splitease_token");
    setUser(null);
    // Also sign out from NextAuth if authenticated via Google
    if (session) {
      await nextAuthSignOut({ redirect: false });
    }
  };

  const googleSignIn = async () => {
    await nextAuthSignIn("google", { redirect: false });
  };

  return {
    user,
    login,
    signup,
    logout,
    googleSignIn,
    isLoading,
  };
}
