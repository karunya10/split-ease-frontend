import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthFormsProps {
  onSignup: (email: string, password: string, name: string) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<void>;
}

export default function AuthForms({ onSignup, onLogin }: AuthFormsProps) {
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const { googleSignIn } = useAuth();

  const handleSignup = async () => {
    try {
      await onSignup(signupForm.email, signupForm.password, signupForm.name);
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  const handleLogin = async () => {
    try {
      await onLogin(loginForm.email, loginForm.password);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (err) {
      console.error("Google sign in failed:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Signup Form */}
        <div className="bg-slate-800 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Get started — Sign up
          </h2>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full name
              </Label>
              <Input
                value={signupForm.name}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, name: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label className="text-gray-300 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email address
              </Label>
              <Input
                type="email"
                value={signupForm.email}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, email: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label className="text-gray-300 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Create password
              </Label>
              <Input
                type="password"
                value={signupForm.password}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, password: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                placeholder="Create a strong password"
              />
            </div>

            <Button
              onClick={handleSignup}
              className="w-full bg-teal-400 text-slate-900 hover:bg-teal-500 font-semibold py-3"
            >
              Create account
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800 px-2 text-gray-400">Or</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600 py-3"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Quick login
          </h2>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email address
              </Label>
              <Input
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label className="text-gray-300 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>

            <Button
              onClick={handleLogin}
              className="w-full bg-teal-400 text-slate-900 hover:bg-teal-500 font-semibold py-3"
            >
              Log in
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800 px-2 text-gray-400">Or</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600 py-3"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
