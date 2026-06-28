import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { addCompetitor } from "~/server/competitors";

export const Route = createFileRoute("/dashboard/competitors/new")({ component: NewCompetitorPage });

const POPULAR_COMPETITORS = [
  { name: "Notion", url: "https://notion.so" },
  { name: "Linear", url: "https://linear.app" },
  { name: "Vercel", url: "https://vercel.com" },
  { name: "Stripe", url: "https://stripe.com" },
];

function NewCompetitorPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await addCompetitor({ data: { name, url, description } });
      navigate({ to: "/dashboard/competitors" });
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("PLAN_LIMIT")) {
        setError(msg.replace("PLAN_LIMIT: ", ""));
      } else {
        setError("Failed to add competitor. Please try again.");
      }
      setLoading(false);
    }
  }

  function fillQuickAdd(competitor: { name: string; url: string }) {
    setName(competitor.name);
    setUrl(competitor.url);
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link to="/dashboard/competitors" className="text-gray-400 hover:text-gray-600 text-sm">
          ← Back to competitors
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Add a competitor</h1>
        <p className="text-gray-500 text-sm mt-1">We\'ll start monitoring them immediately after you add them.</p>
      </div>

      {/* Quick add suggestions */}
      <div className="mb-6">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Quick add popular sites</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_COMPETITORS.map((c) => (
            <button
              key={c.name}
              onClick={() => fillQuickAdd(c)}
              className="text-sm border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition"
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
              {error.includes("Upgrade") && (
                <Link to="/pricing" className="ml-2 font-semibold underline">Upgrade now →</Link>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Competitor name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              placeholder="e.g. Acme Corp"
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://acme.com"
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-gray-400 text-xs mt-1.5">We\'ll monitor this URL for any changes.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="What do they do? Why are they a competitor?"
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              to="/dashboard/competitors"
              className="flex-1 text-center border border-gray-200 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 text-sm"
            >
              {loading ? "Adding & scanning..." : "Add competitor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
