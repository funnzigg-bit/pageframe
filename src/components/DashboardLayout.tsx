import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Camera,
  History,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import pageframeLogo from "@/assets/pageframe-logo.png";

const navItems = [
  { icon: Camera, label: "New Capture", path: "/dashboard" },
  { icon: History, label: "History", path: "/history" },
  { icon: FolderOpen, label: "Projects", path: "/projects" },
  { icon: Clock, label: "Schedules", path: "/schedules" },
  { icon: Users, label: "Team", path: "/team" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const DashboardLayout = ({ children, active }: { children: ReactNode; active: string }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const navContent = (
    <>
      <div className="px-4 pb-4 pt-5">
        <button className="flex items-center gap-3" onClick={() => navigate("/dashboard")}>
          <img src={pageframeLogo} alt="PageFrame" className="h-8" />
          <div className="text-left">
            <div className="text-sm font-semibold text-sidebar-foreground">PageFrame</div>
            <div className="text-xs uppercase tracking-[0.24em] text-sidebar-foreground/50">Capture Studio</div>
          </div>
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors ${
              item.label === active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_16px_30px_-18px_rgba(249,115,22,0.7)]"
                : "text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-4">
        <button
          onClick={() => setDark(!dark)}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-sidebar-foreground/72 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span>{dark ? "Light mode" : "Dark mode"}</span>
        </button>

        <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="text-xs uppercase tracking-[0.2em] text-sidebar-foreground/45">Signed in as</div>
          <div className="mt-2 truncate text-sm text-sidebar-foreground">{user?.email}</div>
        </div>

        <button
          onClick={handleSignOut}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-sidebar-foreground/72 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
          {navContent}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <button className="flex items-center gap-3" onClick={() => navigate("/dashboard")}>
                <img src={pageframeLogo} alt="PageFrame" className="h-7" />
                <span className="font-semibold">PageFrame</span>
              </button>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </header>

          {mobileOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-slate-950/55" onClick={() => setMobileOpen(false)} />
              <aside className="relative h-full w-72 bg-sidebar shadow-2xl">
                {navContent}
              </aside>
            </div>
          )}

          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
