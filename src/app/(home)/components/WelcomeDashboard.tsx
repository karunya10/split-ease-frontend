import { Button } from "@/components/ui/button";
import FeatureGrid from "./FeatureGrid";

interface User {
  name?: string;
  email: string;
}

interface WelcomeDashboardProps {
  user: User;
}

export default function WelcomeDashboard({ user }: WelcomeDashboardProps) {
  return (
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-teal-400 rounded flex items-center justify-center">
            <span className="text-slate-900 font-bold">👥</span>
          </div>
          <h1 className="text-5xl font-bold">Welcome to SplitEase</h1>
        </div>

        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Track shared expenses, settle up with friends, and keep group chats in
          one place. Designed for students and young professionals.
        </p>

        <FeatureGrid />

        <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Hello, {user.name || user.email}! 🎉
          </h2>
          <p className="text-lg mb-6">
            You&apos;re successfully logged in and ready to start managing your
            shared expenses.
          </p>
          <Button className="bg-white text-slate-900 hover:bg-gray-100 font-semibold px-8 py-3">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
