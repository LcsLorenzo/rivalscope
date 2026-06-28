import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { authClient } from "~/lib/auth-client";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <span className="font-bold text-lg text-gray-900 dark:text-white">RivalScope</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="p-3 flex-1">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const active = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                      active
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom: plan + user */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
          {plan === "free" && (
            <Link
              to="/pricing"
              className="block bg-indigo-600 text-white text-center py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
            >
              ⭐ Upgrade to Pro
            </Link>
          )}
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-600">
              {session?.user?.name?.charAt(0) ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                {session?.user?.name ?? session?.user?.email ?? "Loading..."}
              </p>
              <p className="text-xs text-gray-400 capitalize">{plan}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
