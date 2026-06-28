import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({ component: DashboardLayout });

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: "📊", exact: true },
  { to: "/dashboard/competitors", label: "Competitors", icon: "🔍" },
  { to: "/dashboard/alerts", label: "Alerts", icon: "🔔" },
  { to: "/pricing", label: "Upgrade", icon: "⭐" },
];

function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <span className="font-bold text-xl text-gray-900">RivalScope</span>
          </Link>
        </div>
        <nav className="p-4 flex-1">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Link
            to="/pricing"
            className="block bg-indigo-600 text-white text-center py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
          >
            ⭐ Upgrade to Pro
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
