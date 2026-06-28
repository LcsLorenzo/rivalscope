import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/competitors/")({ component: CompetitorsPage });

function CompetitorsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Competitors</h1>
        <Link
          to="/dashboard/competitors/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
        >
          + Add competitor
        </Link>
      </div>
      <p className="text-gray-500">No competitors yet. Add one to start monitoring.</p>
    </div>
  );
}
