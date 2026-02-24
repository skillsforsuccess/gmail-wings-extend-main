import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, BarChart3, Chrome, Mail } from "lucide-react";

const navItems = [
  { to: "/", label: "Pipeline", icon: LayoutDashboard },
  { to: "/contacts", label: "Contacts", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/popup", label: "Extension Popup", icon: Chrome },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-sidebar flex flex-col border-r border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-5">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Mail className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-primary-foreground tracking-tight">
            GmailCRM
          </span>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 px-3">
            <div className="w-7 h-7 rounded-full bg-sidebar-primary flex items-center justify-center text-xs font-bold text-sidebar-primary-foreground">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">user@example.com</p>
              <p className="text-[10px] text-sidebar-foreground">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
}
