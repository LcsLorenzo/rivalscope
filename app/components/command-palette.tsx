import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";

const COMMANDS = [
  { id: "dashboard",     label: "Go to Dashboard",       icon: "📊", to: "/dashboard"                     },
  { id: "competitors",   label: "View Competitors",       icon: "🔍", to: "/dashboard/competitors"         },
  { id: "add",           label: "Add Competitor",         icon: "➕",    to: "/dashboard/competitors/new"    },
  { id: "alerts",        label: "View Alerts",            icon: "🔔", to: "/dashboard/alerts"              },
  { id: "settings",      label: "Settings",               icon: "⚙️",  to: "/dashboard/settings"           },
  { id: "pricing",       label: "View Pricing",           icon: "💰", to: "/pricing"                       },
  { id: "billing",       label: "Manage Billing",         icon: "📄", to: "/dashboard/settings"           },
  { id: "home",          label: "Go to Homepage",         icon: "🏠", to: "/"                             },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery]   = useState("");
  const navigate = useNavigate();

  const close = useCallback(() => { setOpen(false); setQuery(""); }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-400 text-lg">🔍</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-sm"
          />
          <kbd className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-1 rounded-md">ESC</kbd>
        </div>

        {/* Results */}
        <ul className="py-2 max-h-72 overflow-y-auto">
          {filtered.length === 0 ? (
            <li className="px-4 py-8 text-center text-gray-400 text-sm">No commands found</li>
          ) : (
            filtered.map((cmd) => (
              <li key={cmd.id}>
                <button
                  onClick={() => { navigate({ to: cmd.to }); close(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-300 transition text-left text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="text-base w-5 text-center">{cmd.icon}</span>
                  {cmd.label}
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <span className="text-xs text-gray-400">
            <kbd className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">↑↓</kbd> navigate
          </span>
          <span className="text-xs text-gray-400">
            <kbd className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">↵</kbd> select
          </span>
          <span className="text-xs text-gray-400 ml-auto">
            <kbd className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">⌘K</kbd> to toggle
          </span>
        </div>
      </div>
    </div>
  );
}
