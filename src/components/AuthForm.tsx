"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AuthForm({ type }: { type: "login" | "signup" }) {
  const { login, signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (type === "login") {
        await login(form.email, form.password);
      } else {
        await signup(form.email, form.password, form.name);
      }
      // Redirect handled by auth context
    } catch (err) {
      setError(err instanceof Error ? err.message : `${type} failed`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[320px] mx-auto mt-20 p-4 shadow-md">
      <CardContent className="space-y-4">
        <h2 className="text-2xl font-semibold text-center capitalize">
          {type}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {type === "signup" && (
          <div>
            <Label>Full Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              type="text"
              placeholder="Your full name"
            />
          </div>
        )}

        <div>
          <Label>Email</Label>
          <Input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <Label>Password</Label>
          <Input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            type="password"
            placeholder="********"
          />
        </div>

        <Button
          className="w-full mt-2"
          onClick={handleSubmit}
          disabled={isLoading || !form.email || !form.password}
        >
          {isLoading ? "Loading..." : type === "login" ? "Login" : "Sign Up"}
        </Button>
      </CardContent>
    </Card>
  );
}
