import { createFileRoute }  from "@tanstack/react-router";
import { useState }         from "react";
import { listAlerts, markAlertRead, markAllRead } from "~/server/alerts";
import { useToast }         from "~/components/toast";
import type { Alert }       from "../../drizzle/schema";

export const Route = createFileRoute("/dashboard/alerts")({ 
  loader: () => listAlerts(),
  component: AlertsPage,
});

const TYPE_META: Record<string, { icon: string; label: string; color: string }> = {
  price:       { icon: "💰", label: "Price change",  color: "text-green-600  bg-green-50  dark:bg-green-900/20"  },
  feature:     { icon: "🆕", label: "New feature",   color: "text-blue-600   bg-blue-50   dark:bg-blue-900/20"   },
  content:     { icon: "📝", label: "Content update",color: "text-gray-600   bg-gray-50   dark:bg-gray-900/20"   },
  new_page:    { icon: "➕",    label: "New page",      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" },
  removed_page:{ icon: "➖",    label: "Page removed",  color: "text-red-600    bg-red-50    dark:bg-red-900/20"    },
  cta:         { icon: "📎", label: "CTA changed",   color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20" },
};

function AlertsPage() {
  const initial = Route.useLoaderData();
  const [alerts, setAlerts] = useState<Alert[]>(initial ?? []);
  const [filter, setFilter] = useState<string>("all");
  const toast = useToast();

  const unread = alerts.filter((a) => a.status === "unread").length;
  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.type === filter);

  async function handleMarkRead(id: string) {
    await markAlertRead({ data: { id } });
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: "read" } : a)));
  }

  async function handleMarkAllRead() {
    await markAllRead();
    setAlerts((prev) => prev.map((a) => ({ ...a, status: "read" })));
    toast.success("All alerts marked as read");
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alerts</h1>
          <p className="text-gray-500 text-sm mt-1">
            {unread > 0 ? <><span className="text-indigo-600 font-semibold">{unread} unread</span> · </> : null}
            {alerts.length} total
          </p>
        </div>
        {unread > 0 && (
          <button onClick={handleMarkAllRead} className="text-sm text-indigo-600 hover:text-indigo-500 font-medium border border-indigo-200 dark:border-indigo-800 px-4 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition">
            Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {["all", ...Object.keys(TYPE_META)].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition ${
              filter === t
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {t === "all" ? "All" : TYPE_META[t]!.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔔</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No alerts yet</h3>
          <p className="text-gray-400 text-sm">Alerts will appear here when competitors change something.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((alert) => {
            const meta = TYPE_META[alert.type] ?? TYPE_META.content!;
            const isUnread = alert.status === "unread";
            return (
              <div
                key={alert.id}
                onClick={() => isUnread && handleMarkRead(alert.id)}
                className={`bg-white dark:bg-gray-900 border rounded-2xl p-5 cursor-pointer transition hover:shadow-sm ${
                  isUnread
                    ? "border-indigo-200 dark:border-indigo-700"
                    : "border-gray-100 dark:border-gray-800"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${
                    meta.color.split(" ").slice(1).join(" ")
                  }`}>
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{alert.title}</p>
                      {isUnread && <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />}
                    </div>
                    {alert.summary && (
                      <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{alert.summary}</p>
                    )}
                    <p className="text-gray-300 dark:text-gray-600 text-xs mt-2">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                    meta.color
                  }`}>
                    {meta.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
