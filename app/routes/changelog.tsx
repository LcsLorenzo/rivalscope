import { createFileRoute, Link } from "@tanstack/react-router";
import { ThemeToggle } from "~/components/theme-toggle";
import { pageMeta } from "~/lib/seo";

export const Route = createFileRoute("/changelog")({ 
  head: () => ({
    meta: pageMeta({
      title: "Changelog — RivalScope",
      description: "See what's new in RivalScope. Product updates, improvements, and bug fixes.",
      path: "/changelog",
    }),
  }),
  component: ChangelogPage,
});

const ENTRIES = [
  {
    version: "1.0.0",
    date: "June 28, 2026",
    badge: "Launch",
    badgeColor: "bg-green-100 text-green-700",
    changes: [
      { type: "new",  text: "Initial launch 🎉 — monitor up to 2 competitors for free" },
      { type: "new",  text: "AI-powered change summaries using GPT-4o-mini" },
      { type: "new",  text: "Real-time price change detection" },
      { type: "new",  text: "Email alerts via Resend" },
      { type: "new",  text: "Pro plan: 10 competitors, hourly checks, $29/month" },
      { type: "new",  text: "Agency plan: unlimited competitors, API access, $99/month" },
      { type: "new",  text: "14-day free trial on all paid plans" },
      { type: "new",  text: "Dark mode support" },
      { type: "new",  text: "Command palette (⌘K)" },
    ],
  },
];

const TYPE_STYLES: Record<string, { label: string; color: string }> = {
  new:      { label: "New",      color: "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-300"   },
  improved: { label: "Improved", color: "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-300"  },
  fixed:    { label: "Fixed",    color: "bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-300"  },
  removed:  { label: "Removed",  color: "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-300"    },
};

function ChangelogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="text-2xl">🔍</span>
            <span className="font-bold text-xl text-gray-900 dark:text-white">RivalScope</span>
          </Link>
          <ThemeToggle />
        </nav>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Changelog</h1>
          <p className="text-gray-500 dark:text-gray-400">Everything that's shipped in RivalScope.</p>
        </div>

        <div className="space-y-12">
          {ENTRIES.map((entry) => (
            <div key={entry.version} className="relative pl-8 border-l-2 border-indigo-100 dark:border-indigo-900">
              {/* Timeline dot */}
              <div className="absolute -left-2.5 top-0 w-5 h-5 bg-indigo-600 rounded-full border-4 border-white dark:border-gray-950" />

              <div className="mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">v{entry.version}</h2>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${entry.badgeColor}`}>
                    {entry.badge}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{entry.date}</p>
              </div>

              <ul className="space-y-2">
                {entry.changes.map((change, i) => {
                  const style = TYPE_STYLES[change.type] ?? TYPE_STYLES["new"]!;
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5 ${style.color}`}>
                        {style.label}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">{change.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
