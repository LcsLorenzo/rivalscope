import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "~/lib/auth-client";

export const Route = createFileRoute("/onboarding")({ component: OnboardingPage });

const STEPS = [
  { id: 1, title: "Welcome to RivalScope",    desc: "Monitor any competitor in 30 seconds. Let’s get you set up." },
  { id: 2, title: "What are you tracking?",   desc: "Tell us who you want to monitor so we can set up your first scan." },
  { id: 3, title: "You’re ready to go! 🎉",  desc: "Your first competitor is queued for scanning. Check back in a few minutes." },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const [step, setStep]   = useState(1);
  const [url, setUrl]     = useState("");
  const [name, setName]   = useState("");

  function handleNext() {
    if (step < 3) setStep(step + 1);
    else navigate({ to: "/dashboard" });
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Step {step} of {STEPS.length}</span>
            <span className="text-xs text-gray-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          {step === 1 && (
            <div className="text-center">
              <div className="text-6xl mb-6">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Welcome, {session?.user?.name?.split(" ")[0] ?? "there"}!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                RivalScope monitors competitor websites 24/7 and sends you AI-powered alerts when they change anything important.
              </p>
              <button onClick={handleNext} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-semibold transition">
                Let’s set up your first competitor →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Add your first competitor</h2>
              <p className="text-gray-500 text-sm mb-6">Paste their URL and give them a name. We’ll handle the rest.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Competitor name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Notion, Linear…"
                    className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Their website URL</label>
                  <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://notion.so/pricing"
                    className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <button
                onClick={handleNext}
                disabled={!url || !name}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white py-3.5 rounded-2xl font-semibold transition"
              >
                Start monitoring →
              </button>
              <button onClick={() => navigate({ to: "/dashboard" })} className="w-full mt-3 text-gray-400 hover:text-gray-600 text-sm transition">
                Skip for now
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">You’re all set!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                We’re scanning <strong className="text-gray-700 dark:text-gray-200">{name || "your competitor"}</strong> now.
                You’ll get an alert as soon as anything changes.
              </p>
              <button onClick={handleNext} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-semibold transition">
                Go to dashboard →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
