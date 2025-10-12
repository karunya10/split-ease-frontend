import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AuthFormsProps {
  onSignup: (email: string, password: string, name: string) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<void>;
  isLoginLoading: boolean;
  isSignupLoading: boolean;
  loginError: string | null;
  signupError: string | null;
}

export default function AuthForms({
  onSignup,
  onLogin,
  isLoginLoading,
  isSignupLoading,
  loginError,
  signupError,
}: AuthFormsProps) {
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Signup Form */}
        <div className="bg-slate-800 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Get started — Sign up
          </h2>

          {signupError && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
              {signupError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 mb-2 block">👤 Full name</Label>
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
              <Label className="text-gray-300 mb-2 block">
                📧 Email address
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
              <Label className="text-gray-300 mb-2 block">
                🔒 Create password
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
              disabled={
                isSignupLoading || !signupForm.email || !signupForm.password
              }
              className="w-full bg-teal-400 text-slate-900 hover:bg-teal-500 font-semibold py-3"
            >
              {isSignupLoading ? "Creating account..." : "Create account"}
            </Button>

            <p className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <button className="text-teal-400 hover:underline">Log in</button>
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Quick login
          </h2>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
              {loginError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 mb-2 block">
                📧 Email address
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
              <Label className="text-gray-300 mb-2 block">🔒 Password</Label>
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
              disabled={
                isLoginLoading || !loginForm.email || !loginForm.password
              }
              className="w-full bg-teal-400 text-slate-900 hover:bg-teal-500 font-semibold py-3"
            >
              {isLoginLoading ? "Signing in..." : "Log in"}
            </Button>

            <div className="text-center">
              <button className="text-teal-400 hover:underline text-sm">
                Forgot password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
