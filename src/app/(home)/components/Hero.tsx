import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="max-w-4xl mx-auto text-center mb-16">
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
    </div>
  );
}
