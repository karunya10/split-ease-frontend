import { Button } from "@/components/ui/button";
import ProfileDropdown from "@/components/ProfileDropdown";
import Image from "next/image";

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
        <Image
          src="/favicon.ico"
          alt="SplitEase Logo"
          width={32}
          height={32}
          className="w-8 h-8"
        />
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
