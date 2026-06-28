import { createFileRoute, Link } from "@tanstack/react-router";
import { ThemeToggle } from "~/components/theme-toggle";
import { pageMeta, FAQ_JSON_LD } from "~/lib/seo";

export const Route = createFileRoute("/pricing")({ 
  head: () => ({
    meta: pageMeta({
      title: "Pricing — RivalScope",
      description: "Start free. Monitor 2 competitors. Upgrade for real-time AI alerts, unlimited competitors, and API access. All plans include a 14-day free trial.",
      path: "/pricing",
    }),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(FAQ_JSON_LD) }],
  }),
  component: PricingPage,
});

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "",
    badge: null,
    description: "Perfect for trying out RivalScope",
    cta: "Get started",
    ctaHref: "/auth/register",
    featured: false,
    color: "border-gray-200 dark:border-gray-700",
    features: [
      { text: "2 competitors monitored",       included: true },
      { text: "Weekly change digest",          included: true },
      { text: "Basic change detection",        included: true },
      { text: "Email support",                 included: true },
      { text: "Real-time alerts",              included: false },
      { text: "AI-generated summaries",        included: false },
      { text: "Price change detection",        included: false },
    ],
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    badge: "Most popular",
    description: "For teams serious about competitive intel",
    cta: "Start 14-day trial",
    ctaHref: "/auth/register?plan=pro",
    featured: true,
    color: "border-indigo-500",
    features: [
      { text: "10 competitors monitored",      included: true },
      { text: "Real-time alerts (hourly)",     included: true },
      { text: "AI-generated summaries",        included: true },
      { text: "Price change detection",        included: true },
      { text: "Full change history",           included: true },
      { text: "Email + Slack notifications",   included: true },
      { text: "API access",                    included: false },
    ],
  },
  {
    name: "Agency",
    price: "$99",
    period: "/month",
    badge: null,
    description: "For agencies managing multiple clients",
    cta: "Start 14-day trial",
    ctaHref: "/auth/register?plan=agency",
    featured: false,
    color: "border-gray-200 dark:border-gray-700",
    features: [
      { text: "Unlimited competitors",         included: true },
      { text: "Real-time alerts (hourly)",     included: true },
      { text: "AI-generated summaries",        included: true },
      { text: "Price change detection",        included: true },
      { text: "Full change history",           included: true },
      { text: "Email + Slack notifications",   included: true },
      { text: "Full REST API access",          included: true },
    ],
  },
];

const COMPARISON = [
  { feature: "Competitors monitored", free: "2",         pro: "10",          agency: "Unlimited" },
  { feature: "Check frequency",       free: "Weekly",    pro: "Hourly",       agency: "Hourly"    },
  { feature: "AI summaries",          free: "✕",         pro: "✓",            agency: "✓"         },
  { feature: "Price detection",       free: "✕",         pro: "✓",            agency: "✓"         },
  { feature: "Email alerts",          free: "Weekly",    pro: "Real-time",    agency: "Real-time" },
  { feature: "API access",            free: "✕",         pro: "✕",            agency: "✓"         },
  { feature: "Change history",        free: "7 days",    pro: "90 days",      agency: "Unlimited" },
  { feature: "Support",               free: "Email",     pro: "Priority",     agency: "Dedicated" },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="text-2xl">🔍</span>
            <span className="font-bold text-xl text-gray-900 dark:text-white">RivalScope</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/auth/login" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Sign in</Link>
          </div>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Simple, honest pricing</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">Start free forever. Upgrade when you need more power.</p>
          <p className="text-indigo-600 font-semibold mt-2">✨ All paid plans include a 14-day free trial. No credit card required.</p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border-2 p-8 flex flex-col relative ${
                plan.featured ? `${plan.color} shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/30` : plan.color
              } bg-white dark:bg-gray-900`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                    {plan.badge.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-5xl font-black text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-400 text-lg">{plan.period}</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f.text} className={`flex items-start gap-2.5 text-sm ${
                    f.included ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-600"
                  }`}>
                    <span className={`font-bold mt-0.5 ${ f.included ? "text-indigo-500" : "text-gray-300 dark:text-gray-700"}`}>
                      {f.included ? "✓" : "×"}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaHref}
                className={`text-center py-3.5 rounded-2xl font-bold text-sm transition ${
                  plan.featured
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">Full comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Feature</th>
                  {["Free", "Pro", "Agency"].map((p) => (
                    <th key={p} className="text-center px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">{row.free}</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-indigo-600">{row.pro}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">{row.agency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm">All prices in USD. VAT may apply. Cancel anytime.</p>
      </div>
    </div>
  );
}
