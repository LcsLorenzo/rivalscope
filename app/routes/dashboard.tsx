import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { authClient } from "~/lib/auth-client";
import { ThemeToggle } from "~/components/theme-toggle";

export const Route = createFileRoute("/dashboard")({ component: DashboardLayout });

const NAV = [
  { to: "/dashboard",             label: "Overview",    icon: "📊", exact: true },
  { to: "/dashboard/competitors", label: "Competitors",  icon: "🔍" },
  { to: "/dashboard/alerts",      label: "Alerts",       icon: "🔔" },
  { to: "/dashboard/settings",    label: "Settings",     icon: "⚙️" },
];

function DashboardLayout() {
  const location = useLocation();
  const { data: session } = authClient.useSession();
  const plan = (session?.user as any)?.plan ?? "free";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* ── Sidebar ── */}
      <aside className="w-60 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col flex-shrink-0 sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <span className="font-bold text-lg text-gray-900 dark:text-white">RivalScope</span>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="p-3 flex-1 overflow-y-auto">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const active = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to) && item.to !== "/dashboard";
              const dashActive = item.to === "/dashboard" && location.pathname === "/dashboard";
              const isActive = item.exact ? dashActive : active;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <span className="text-base w-5 text-center">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Keyboard shortcut hint */}
          <div className="mt-6 px-3">
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Press{" "}
              <kbd className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded text-gray-500 text-xs">⌘K</kbd>
              {" "}for commands
            </p>
          </div>
        </nav>

        {/* Bottom: plan badge + user + theme */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
          {plan === "free" && (
            <Link
              to="/pricing"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl text-xs font-bold hover:opacity-90 transition"
            >
              ⭐ Upgrade to Pro
            </Link>
          )}
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
              {session?.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
                {session?.user?.name ?? session?.user?.email ?? "..."}
              </p>
              <p className="text-xs text-gray-400 capitalize">{plan} plan</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
