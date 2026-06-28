import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { listAlerts, markAlertSeen, markAllAlertsSeen } from "~/server/alerts";
import { timeAgo } from "~/lib/utils";

export const Route = createFileRoute("/dashboard/alerts/")({ 
  loader: () => listAlerts(),
  component: AlertsPage,
});

const ALERT_META: Record<string, { label: string; icon: string; color: string }> = {
  content_change: { label: "Content change", icon: "📝", color: "bg-blue-50 text-blue-700" },
  price_change:   { label: "Price change",   icon: "💰", color: "bg-amber-50 text-amber-700" },
  new_page:       { label: "New page",       icon: "🆕", color: "bg-green-50 text-green-700" },
  social_post:    { label: "Social post",    icon: "🐦", color: "bg-purple-50 text-purple-700" },
};

function AlertsPage() {
  const alerts = Route.useLoaderData();
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const unseenCount = alerts.filter((a: any) => !a.seen).length;

  async function handleMarkAll() {
    await markAllAlertsSeen();
    router.invalidate();
  }

  const filtered = filter === "all"
    ? alerts
    : alerts.filter((a: any) => a.type === filter);

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alerts</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {unseenCount > 0 ? (
              <span className="text-indigo-600 font-medium">{unseenCount} new alert{unseenCount > 1 ? "s" : ""}</span>
            ) : "All caught up 🎉"}
          </p>
        </div>
        {unseenCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "price_change", "content_change", "new_page"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`text-sm px-3 py-1.5 rounded-lg font-medium transition ${
              filter === type
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {type === "all" ? "All" : ALERT_META[type]?.label ?? type}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-16 text-center">
          <div className="text-5xl mb-4">🔔</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No alerts yet</h3>
          <p className="text-gray-500 text-sm">Alerts will appear here when competitors make changes.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((alert: any) => {
            const meta = ALERT_META[alert.type] ?? ALERT_META["content_change"]!;
            return (
              <AlertCard
                key={alert.id}
                alert={alert}
                meta={meta}
                onSeen={async () => {
                  await markAlertSeen({ data: { id: alert.id } });
                  router.invalidate();
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function AlertCard({ alert, meta, onSeen }: {
  alert: any;
  meta: { label: string; icon: string; color: string };
  onSeen: () => void;
}) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border p-5 ${
      alert.seen
        ? "border-gray-100 dark:border-gray-700"
        : "border-indigo-200 dark:border-indigo-700 shadow-sm shadow-indigo-100"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl mt-0.5">{meta.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{alert.title}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.color}`}>
                {meta.label}
              </span>
              {!alert.seen && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                  New
                </span>
              )}
            </div>
            {alert.summary && (
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{alert.summary}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-gray-400 text-xs">{timeAgo(alert.createdAt)}</span>
          {!alert.seen && (
            <button
              onClick={onSeen}
              className="text-xs text-gray-400 hover:text-indigo-600 transition"
            >
              Mark read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
