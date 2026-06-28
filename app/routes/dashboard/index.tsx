import { createFileRoute, Link }  from "@tanstack/react-router";
import { createServerFn }         from "@tanstack/react-start";
import { getDashboardStats }       from "~/server/dashboard";
import { authClient }             from "~/lib/auth-client";
import { PLAN_LIMITS }            from "~/lib/plans";
import type { Plan }              from "~/lib/plans";

export const Route = createFileRoute("/dashboard/")({ 
  loader: () => getDashboardStats(),
  component: DashboardHome,
});

function DashboardHome() {
  const stats  = Route.useLoaderData();
  const { data: session } = authClient.useSession();
  const plan   = ((session?.user as any)?.plan ?? stats?.plan ?? "free") as Plan;
  const limit  = PLAN_LIMITS[plan].competitors;
  const pct    = limit === Infinity ? 0 : Math.round((stats.competitorCount / limit) * 100);

  const STAT_CARDS = [
    { label: "Competitors", value: stats.competitorCount, icon: "🔍", color: "text-indigo-600",  bg: "bg-indigo-50  dark:bg-indigo-900/20"  },
    { label: "Unread alerts",value: stats.unreadCount,     icon: "🔔", color: "text-amber-600",   bg: "bg-amber-50   dark:bg-amber-900/20"   },
    { label: "Total changes", value: stats.totalAlerts,    icon: "⚡",    color: "text-emerald-600",bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Plan",          value: plan.charAt(0).toUpperCase() + plan.slice(1), icon: "💰", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {session?.user?.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Here’s what’s happening with your competitors
          </p>
        </div>
        <Link
          to="/dashboard/competitors"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          <span>+</span> Add competitor
        </Link>
      </div>

      {/* Upgrade banner for free users */}
      {plan === "free" && (
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">⭐ Upgrade to Pro</p>
            <p className="text-indigo-100 text-sm mt-0.5">
              Monitor 10 competitors with hourly checks &amp; AI summaries.
            </p>
          </div>
          <Link
            to="/pricing"
            className="flex-shrink-0 bg-white text-indigo-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition"
          >
            Upgrade →
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>
              {s.icon}
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Plan usage bar */}
      {limit !== Infinity && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Competitor slots used</p>
            <p className="text-sm text-gray-500">{stats.competitorCount} / {limit}</p>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-indigo-500"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct >= 90 && (
            <p className="text-xs text-red-500 mt-2">
              Almost at your limit.{" "}
              <Link to="/pricing" className="underline">Upgrade now</Link>
            </p>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { to: "/dashboard/competitors", icon: "🔍", title: "Manage competitors", desc: "Add, pause, or remove competitors" },
          { to: "/dashboard/alerts",      icon: "🔔", title: "View alerts",       desc: `${stats.unreadCount} unread change${stats.unreadCount !== 1 ? "s" : ""}` },
          { to: "/dashboard/settings",    icon: "⚙️",  title: "Settings",         desc: "Profile, billing, notifications" },
        ].map((a) => (
          <Link
            key={a.to} to={a.to}
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-sm transition flex items-start gap-4"
          >
            <span className="text-2xl">{a.icon}</span>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{a.title}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
