import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { addCompetitor } from "~/server/competitors";

export const Route = createFileRoute("/onboarding")({ component: OnboardingPage });

const STEPS = [
  { id: 1, title: "Welcome to RivalScope 🔍",     desc: "Let's set up your monitoring in 2 minutes." },
  { id: 2, title: "Add your first competitor", desc: "Enter a competitor website URL to start tracking." },
  { id: 3, title: "You're all set! 🎉",          desc: "We're scanning your competitor right now." },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAddCompetitor(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await addCompetitor({ data: { name, url } });
      setStep(3);
    } catch (err: any) {
      setError(err?.message ?? "Failed to add competitor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s) => (
            <div key={s.id} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all ${
                s.id <= step ? "bg-indigo-600" : "bg-gray-200"
              }`} />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 p-8 md:p-10">
          {step === 1 && (
            <div className="text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Welcome to RivalScope</h1>
              <p className="text-gray-500 mb-8">
                You\'re about to have 24/7 competitive intelligence on autopilot.
                Let\'s add your first competitor.
              </p>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-semibold hover:bg-indigo-700 transition text-lg"
              >
                Get started →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Add your first competitor</h1>
              <p className="text-gray-500 text-sm mb-8">We\'ll start scanning them right away.</p>
              <form onSubmit={handleAddCompetitor} className="space-y-5">
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Competitor name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Acme Corp"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    placeholder="https://acme.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 text-base"
                >
                  {loading ? "Adding & scanning..." : "Add competitor & continue"}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">You\'re all set!</h1>
              <p className="text-gray-500 mb-3">
                We\'re scanning <strong>{name}</strong> right now.
                You\'ll get an alert as soon as we detect any changes.
              </p>
              <p className="text-indigo-600 text-sm font-medium mb-8">
                ⚡ First scan usually completes within 2 minutes.
              </p>
              <button
                onClick={() => navigate({ to: "/dashboard" })}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-semibold hover:bg-indigo-700 transition text-base"
              >
                Go to dashboard →
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Step {step} of {STEPS.length}
        </p>
      </div>
    </div>
  );
}
