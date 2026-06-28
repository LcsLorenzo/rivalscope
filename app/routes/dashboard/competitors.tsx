import { createFileRoute, useRouter }  from "@tanstack/react-router";
import { useState }                    from "react";
import { listCompetitors, addCompetitor, toggleCompetitor, deleteCompetitor } from "~/server/competitors";
import { useToast }                    from "~/components/toast";
import { authClient }                  from "~/lib/auth-client";
import { PLAN_LIMITS }                 from "~/lib/plans";
import type { Competitor }             from "../../drizzle/schema";
import type { Plan }                   from "~/lib/plans";

export const Route = createFileRoute("/dashboard/competitors")({ 
  loader: () => listCompetitors(),
  component: CompetitorsPage,
});

function CompetitorsPage() {
  const initialData  = Route.useLoaderData();
  const [items, setItems] = useState<Competitor[]>(initialData ?? []);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const toast  = useToast();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const plan   = ((session?.user as any)?.plan ?? "free") as Plan;
  const limit  = PLAN_LIMITS[plan].competitors;
  const atLimit = limit !== Infinity && items.filter((c) => c.active).length >= limit;

  async function handleToggle(id: string, active: boolean) {
    try {
      const updated = await toggleCompetitor({ data: { id, active: !active } });
      setItems((prev) => prev.map((c) => (c.id === id ? { ...c, active: !active } : c)));
      toast.success(active ? "Competitor paused" : "Competitor resumed");
    } catch {
      toast.error("Failed to update competitor");
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await deleteCompetitor({ data: { id } });
      setItems((prev) => prev.filter((c) => c.id !== id));
      toast.success("Competitor deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Competitors</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {items.length} monitored · {limit === Infinity ? "∞" : limit} max on {plan} plan
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={atLimit}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          + Add competitor
        </button>
      </div>

      {atLimit && (
        <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center justify-between">
          <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">
            ⚠️ You’ve reached your {plan} plan limit ({limit} competitors).
          </p>
          <a href="/pricing" className="text-xs font-bold text-amber-600 underline">Upgrade</a>
        </div>
      )}

      {showForm && (
        <AddCompetitorForm
          onClose={() => setShowForm(false)}
          onAdded={(c) => { setItems((p) => [c, ...p]); setShowForm(false); }}
        />
      )}

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No competitors yet</h3>
          <p className="text-gray-400 text-sm mb-6">Add your first competitor URL and we’ll start monitoring it.</p>
          <button onClick={() => setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition">
            Add first competitor
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <div key={c.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center font-bold text-indigo-600 text-sm flex-shrink-0">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{c.name}</p>
                <p className="text-gray-400 text-xs truncate">{c.url}</p>
                {c.lastChecked && (
                  <p className="text-gray-300 dark:text-gray-600 text-xs mt-0.5">
                    Last checked: {new Date(c.lastChecked).toLocaleString()}
                  </p>
                )}
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                c.active
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500"
              }`}>
                {c.active ? "● Active" : "○ Paused"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(c.id, c.active)}
                  className="text-xs border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-400"
                >
                  {c.active ? "Pause" : "Resume"}
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={deleting === c.id}
                  className="text-xs border border-red-200 dark:border-red-900 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition text-red-500 disabled:opacity-50"
                >
                  {deleting === c.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddCompetitorForm({ onClose, onAdded }: { onClose: () => void; onAdded: (c: Competitor) => void }) {
  const [name, setName]   = useState("");
  const [url, setUrl]     = useState("");
  const [desc, setDesc]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const competitor = await addCompetitor({ data: { name, url, description: desc || undefined } });
      toast.success("Competitor added!", `Now monitoring ${name}`);
      onAdded(competitor);
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("PLAN_LIMIT")) {
        setError("You’ve reached your plan limit. Upgrade to add more.");
      } else {
        setError(msg || "Failed to add competitor");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add competitor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Notion" className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">URL</label>
            <input required type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://notion.so/pricing" className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What to watch for…" className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold transition">
              {loading ? "Adding…" : "Add competitor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
