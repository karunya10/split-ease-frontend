import { Button } from "@/components/ui/button";

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout?: () => void;
}

export default function Header({ isAuthenticated, onLogout }: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-6">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-teal-400 rounded"></div>
        <span className="text-xl font-semibold">SplitEase</span>
      </div>

      <div className="flex gap-2">
        {isAuthenticated && (
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-slate-900"
          >
            Sign Out
          </Button>
        )}
      </div>
    </header>
  );
}
