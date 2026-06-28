import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({ component: PricingPage });

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for trying out RivalScope",
    cta: "Get started",
    ctaHref: "/auth/register",
    featured: false,
    features: [
      "2 competitors monitored",
      "Weekly change digest",
      "Basic change detection",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For teams serious about competitive intel",
    cta: "Start 14-day trial",
    ctaHref: "/auth/register?plan=pro",
    featured: true,
    features: [
      "10 competitors monitored",
      "Real-time alerts (hourly checks)",
      "AI-generated change summaries",
      "Price change detection",
      "Email + Slack notifications",
      "Full change history",
      "Priority support",
    ],
  },
  {
    name: "Agency",
    price: "$99",
    period: "/month",
    description: "For agencies managing multiple clients",
    cta: "Start 14-day trial",
    ctaHref: "/auth/register?plan=agency",
    featured: false,
    features: [
      "Unlimited competitors",
      "Real-time alerts (hourly checks)",
      "AI-generated change summaries",
      "Price change detection",
      "Email + Slack notifications",
      "Full change history",
      "Multi-workspace support",
      "Full REST API access",
      "Dedicated support",
    ],
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          <span className="font-bold text-xl text-gray-900">RivalScope</span>
        </Link>
        <Link
          to="/auth/login"
          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          Sign in
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-gray-500 text-lg">Start free. Upgrade when you need more.</p>
          <p className="text-indigo-600 font-medium mt-2">All paid plans include a 14-day free trial.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border-2 p-8 flex flex-col ${
                plan.featured
                  ? "border-indigo-600 shadow-xl shadow-indigo-100"
                  : "border-gray-100"
              }`}
            >
              {plan.featured && (
                <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                  MOST POPULAR
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mt-2 mb-1">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">{plan.description}</p>
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-indigo-500 font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.ctaHref}
                className={`text-center py-3 rounded-xl font-semibold transition ${
                  plan.featured
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-12">
          All prices in USD. Cancel anytime. No questions asked.
        </p>
      </div>
    </div>
  );
}
