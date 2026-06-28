import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { db } from "~/lib/db";
import { competitors, alerts } from "~/lib/schema";
import { eq, desc, count } from "drizzle-orm";
import { timeAgo } from "~/lib/utils";

const getDashboardData = createServerFn({ method: "GET" }).handler(async () => {
  // TODO: get userId from session
  // const session = await getSession();
  // For now return mock structure
  return { competitors: [], alerts: [], stats: { total: 0, unseen: 0 } };
});

export const Route = createFileRoute("/dashboard/")({
  loader: () => getDashboardData(),
  component: DashboardPage,
});

function DashboardPage() {
  const { competitors: competitorList, alerts: alertList, stats } = Route.useLoaderData();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor your competitors in real-time</p>
        </div>
        <Link
          to="/dashboard/competitors/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
        >
          + Add competitor
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Competitors monitored" value={String(competitorList.length)} icon="🔍" />
        <StatCard label="Alerts this week" value={String(alertList.length)} icon="🔔" />
        <StatCard label="Unseen alerts" value={String(stats.unseen)} icon="⚡" highlight={stats.unseen > 0} />
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent alerts</h2>
          <Link to="/dashboard/alerts" className="text-indigo-600 text-sm font-medium hover:underline">
            View all
          </Link>
        </div>
        {alertList.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-gray-500">No alerts yet. Add a competitor to start monitoring.</p>
            <Link
              to="/dashboard/competitors/new"
              className="inline-block mt-4 text-indigo-600 font-medium text-sm hover:underline"
            >
              Add your first competitor →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {alertList.slice(0, 5).map((alert: any) => (
              <AlertRow key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, highlight = false }: {
  label: string; value: string; icon: string; highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-6 ${
      highlight ? "border-indigo-200 bg-indigo-50" : "border-gray-100 bg-white"
    }`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-3xl font-bold ${ highlight ? "text-indigo-600" : "text-gray-900"}`}>{value}</div>
      <div className="text-gray-500 text-sm mt-1">{label}</div>
    </div>
  );
}

function AlertRow({ alert }: { alert: any }) {
  return (
    <div className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50 transition">
      <div className="text-2xl">
        {alert.type === "price_change" ? "💰" : alert.type === "content_change" ? "📝" : "🔔"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm">{alert.title}</p>
        {alert.summary && (
          <p className="text-gray-500 text-xs mt-1 truncate">{alert.summary}</p>
        )}
      </div>
      <span className="text-gray-400 text-xs whitespace-nowrap">{timeAgo(alert.createdAt)}</span>
    </div>
  );
}
