import { Link } from "@tanstack/react-router";

export function ErrorBoundaryFallback({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  const isUpgrade = message.includes("PLAN_LIMIT") || message.includes("UPGRADE_REQUIRED");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-6">{isUpgrade ? "🔒" : "🚨"}</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {isUpgrade ? "Upgrade required" : "Something went wrong"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
          {isUpgrade
            ? "This feature is available on Pro and Agency plans."
            : message}
        </p>
        <div className="flex items-center justify-center gap-3">
          {isUpgrade ? (
            <Link to="/pricing" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition">
              View pricing
            </Link>
          ) : (
            <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition">
              Try again
            </button>
          )}
          <Link to="/dashboard" className="border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
