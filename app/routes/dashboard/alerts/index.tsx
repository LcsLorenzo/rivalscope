import { createFileRoute } from "@tanstack/react-router";
import { timeAgo } from "~/lib/utils";

export const Route = createFileRoute("/dashboard/alerts/")({ component: AlertsPage });

const ALERT_TYPE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  content_change: { label: "Content change", icon: "📝", color: "bg-blue-50 text-blue-700" },
  price_change:   { label: "Price change",   icon: "💰", color: "bg-yellow-50 text-yellow-700" },
  new_page:       { label: "New page",       icon: "🆕", color: "bg-green-50 text-green-700" },
  social_post:    { label: "Social post",    icon: "🐦", color: "bg-purple-50 text-purple-700" },
};

function AlertsPage() {
  // alerts will be loaded via TanStack Query in production
  const alerts: any[] = [];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-500 text-sm mt-1">All changes detected across your competitors</p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-16 text-center">
          <div className="text-5xl mb-4">🔔</div>
          <h3 className="font-semibold text-gray-900 mb-2">No alerts yet</h3>
          <p className="text-gray-500 text-sm">
            Alerts will appear here when your competitors make changes.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert: any) => {
            const meta = ALERT_TYPE_LABELS[alert.type] ?? ALERT_TYPE_LABELS["content_change"]!;
            return (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl border p-6 ${
                  alert.seen ? "border-gray-100" : "border-indigo-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{meta.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 text-sm">{alert.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.color}`}>
                          {meta.label}
                        </span>
                        {!alert.seen && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700">
                            New
                          </span>
                        )}
                      </div>
                      {alert.summary && (
                        <p className="text-gray-500 text-sm mt-1">{alert.summary}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-400 text-xs whitespace-nowrap">
                    {timeAgo(alert.createdAt)}
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
