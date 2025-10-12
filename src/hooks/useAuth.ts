import { useState, useEffect } from "react";
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
  isLoading: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await verify();
      setIsLoading(false);
    };
    checkAuth();
  }, []);

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
      setUser(authData.decoded);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("splitease_token");
    setUser(null);
  };

  return {
    user,
    login,
    signup,
    logout,
    isLoading,
  };
}
