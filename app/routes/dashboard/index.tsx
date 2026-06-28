import { createFileRoute, Link } from "@tanstack/react-router";
import { getDashboardStats } from "~/server/dashboard";
import { timeAgo } from "~/lib/utils";

export const Route = createFileRoute("/dashboard/")({ 
  loader: () => getDashboardStats(),
  component: DashboardPage,
});

function DashboardPage() {
  const { competitors, recentAlerts, stats } = Route.useLoaderData();

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Monitor your competitors in real-time</p>
        </div>
        <Link
          to="/dashboard/competitors/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
        >
          <span>+</span> Add competitor
        </Link>
      </div>

      {/* Plan usage banner */}
      {stats.plan === "free" && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-semibold">You\'re on the Free plan</p>
            <p className="text-indigo-200 text-sm">
              {stats.totalCompetitors}/{stats.planLimit} competitors used — upgrade for real-time alerts & AI summaries
            </p>
          </div>
          <Link
            to="/pricing"
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition whitespace-nowrap"
          >
            ⭐ Upgrade to Pro
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🔍" label="Competitors" value={String(stats.totalCompetitors)} sub={`of ${stats.planLimit} limit`} />
        <StatCard icon="🔔" label="Unseen alerts" value={String(stats.unseenAlerts)} highlight={stats.unseenAlerts > 0} />
        <StatCard icon="⚡" label="Active checks" value={String(competitors.filter((c: any) => c.status === "active").length)} />
        <StatCard icon="📊" label="Plan" value={stats.plan.charAt(0).toUpperCase() + stats.plan.slice(1)} />
      </div>

      {/* Competitor list */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Competitors</h2>
          <Link to="/dashboard/competitors" className="text-indigo-600 text-sm hover:underline">View all</Link>
        </div>
        {competitors.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No competitors yet"
            description="Add your first competitor to start monitoring."
            cta={{ label: "Add competitor", to: "/dashboard/competitors/new" }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {competitors.map((c: any) => (
              <CompetitorCard key={c.id} competitor={c} />
            ))}
          </div>
        )}
      </section>

      {/* Recent alerts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Recent alerts</h2>
          <Link to="/dashboard/alerts" className="text-indigo-600 text-sm hover:underline">View all</Link>
        </div>
        {recentAlerts.length === 0 ? (
          <EmptyState icon="🔔" title="No alerts yet" description="Alerts will appear here when competitors make changes." />
        ) : (
          <div className="space-y-2">
            {recentAlerts.map((alert: any) => (
              <AlertRow key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, sub, highlight = false }: {
  icon: string; label: string; value: string; sub?: string; highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${
      highlight
        ? "border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20"
        : "border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700"
    }`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-2xl font-bold ${ highlight ? "text-indigo-600" : "text-gray-900 dark:text-white"}`}>
        {value}
      </div>
      <div className="text-gray-500 text-xs mt-0.5">{label}</div>
      {sub && <div className="text-gray-400 text-xs">{sub}</div>}
    </div>
  );
}

function CompetitorCard({ competitor }: { competitor: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-lg font-bold text-indigo-600">
        {competitor.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{competitor.name}</p>
        <p className="text-gray-400 text-xs truncate">{competitor.url}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
        competitor.status === "active"
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : competitor.status === "error"
          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
      }`}>
        {competitor.status}
      </span>
    </div>
  );
}

function AlertRow({ alert }: { alert: any }) {
  const ICONS: Record<string, string> = {
    price_change: "💰",
    content_change: "📝",
    new_page: "🆕",
    social_post: "🐦",
  };
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border p-4 flex items-start gap-3 ${
      alert.seen ? "border-gray-100 dark:border-gray-700" : "border-indigo-200 dark:border-indigo-700"
    }`}>
      <span className="text-xl">{ICONS[alert.type] ?? "🔔"}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</p>
        {alert.summary && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{alert.summary}</p>}
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(alert.createdAt)}</span>
    </div>
  );
}

function EmptyState({ icon, title, description, cta }: {
  icon: string; title: string; description: string;
  cta?: { label: string; to: string };
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-12 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
      {cta && (
        <Link
          to={cta.to}
          className="inline-block mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
