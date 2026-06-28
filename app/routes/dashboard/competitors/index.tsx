import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { listCompetitors, deleteCompetitor, toggleCompetitor } from "~/server/competitors";
import { timeAgo } from "~/lib/utils";
import type { Competitor } from "../../../../drizzle/schema";

export const Route = createFileRoute("/dashboard/competitors/")({
  loader: () => listCompetitors(),
  component: CompetitorsPage,
});

function CompetitorsPage() {
  const competitors = Route.useLoaderData() as Competitor[];
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Remove this competitor? All its alerts will be deleted.")) return;
    setLoading(id);
    await deleteCompetitor({ data: { id } });
    router.invalidate();
    setLoading(null);
  }

  async function handleToggle(id: string, currentActive: boolean) {
    setLoading(id);
    await toggleCompetitor({ data: { id, active: !currentActive } });
    router.invalidate();
    setLoading(null);
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Competitors</h1>
          <p className="text-gray-500 text-sm mt-0.5">{competitors.length} being monitored</p>
        </div>
        <Link
          to="/dashboard/competitors/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
        >
          + Add competitor
        </Link>
      </div>

      {competitors.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-16 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No competitors yet</h3>
          <p className="text-gray-500 text-sm">Add your first competitor to start monitoring.</p>
          <Link
            to="/dashboard/competitors/new"
            className="inline-block mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition text-sm"
          >
            Add your first competitor
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {competitors.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xl font-bold text-indigo-600 flex-shrink-0">
                {c.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900 dark:text-white">{c.name}</p>
                  <StatusBadge active={c.active} />
                </div>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-indigo-500 truncate block"
                >
                  {c.url}
                </a>
                {c.lastChecked && (
                  <p className="text-xs text-gray-400 mt-0.5">Last checked {timeAgo(c.lastChecked)}</p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggle(c.id, c.active)}
                  disabled={loading === c.id}
                  className="text-xs border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
                >
                  {c.active ? "⏸ Pause" : "▶ Resume"}
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={loading === c.id}
                  className="text-xs border border-red-100 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  if (active) {
    return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</span>;
  }
  return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">Paused</span>;
}