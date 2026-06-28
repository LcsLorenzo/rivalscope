import { useRouter } from "@tanstack/react-router";

export function ErrorBoundaryFallback({ error }: { error: Error }) {
  const router = useRouter();

  const isUpgradeError = error.message.includes("UPGRADE_REQUIRED");
  const isPlanLimitError = error.message.includes("PLAN_LIMIT");

  if (isUpgradeError || isPlanLimitError) {
    return (
      <div className="min-h-[400px] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">⭐</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Upgrade required
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {isPlanLimitError
              ? error.message.replace("PLAN_LIMIT: ", "")
              : "This feature is only available on Pro and Agency plans."}
          </p>
          <a
            href="/pricing"
            className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            View plans →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
        <p className="text-gray-500 text-sm mb-6 font-mono text-xs bg-gray-100 px-3 py-2 rounded-lg">
          {error.message}
        </p>
        <button
          onClick={() => router.invalidate()}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-700 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
