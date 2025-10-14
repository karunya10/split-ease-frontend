import { Button } from "@/components/ui/button";
import ProfileDropdown from "@/components/ProfileDropdown";

interface HeaderProps {
  isAuthenticated: boolean;
  user?: {
    name?: string;
    email: string;
  };
  onLogout?: () => void;
}

export default function Header({
  isAuthenticated,
  user,
  onLogout,
}: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-6">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-teal-400 rounded"></div>
        <span className="text-xl font-semibold">SplitEase</span>
      </div>

      <div className="flex gap-2">
        {isAuthenticated && user && onLogout ? (
          <ProfileDropdown user={user} onLogout={onLogout} />
        ) : isAuthenticated && onLogout ? (
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-slate-900"
          >
            Sign Out
          </Button>
        ) : null}
      </div>
    </header>
  );
}
