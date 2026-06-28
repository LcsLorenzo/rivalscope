import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: LandingPage });

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          <span className="font-bold text-xl text-gray-900">RivalScope</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            Pricing
          </Link>
          <Link
            to="/auth/login"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Sign in
          </Link>
          <Link
            to="/auth/register"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Start free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
          <span>🚀</span>
          <span>AI-powered competitor intelligence</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Know every move your{" "}
          <span className="text-indigo-600">competitors make</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          RivalScope watches your competitors 24/7 and sends instant AI-generated
          alerts when they change prices, launch features, or update their messaging.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/auth/register"
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            Start monitoring for free
          </Link>
          <Link
            to="/pricing"
            className="text-gray-600 hover:text-gray-900 px-8 py-4 rounded-xl text-lg font-medium border border-gray-200 hover:border-gray-300 transition"
          >
            View pricing
          </Link>
        </div>
        <p className="text-gray-400 text-sm mt-4">No credit card required • 14-day Pro trial</p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need to stay ahead
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-50 rounded-2xl p-6 hover:bg-indigo-50 transition group"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-indigo-600 py-16 mt-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-indigo-200 text-sm font-medium mb-2">MARKET OPPORTUNITY</p>
          <h2 className="text-3xl font-bold text-white mb-4">
            $1.2B market growing to $3.8B by 2033
          </h2>
          <p className="text-indigo-200 max-w-xl mx-auto">
            Competitor intelligence is no longer optional. Every serious business needs to
            know what the competition is doing — and RivalScope makes it effortless.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Ready to outpace your competition?
        </h2>
        <p className="text-gray-500 mb-8">
          Join hundreds of teams monitoring their competitors with RivalScope.
        </p>
        <Link
          to="/auth/register"
          className="bg-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition"
        >
          Get started — it's free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <span className="text-gray-400 text-sm">© 2026 RivalScope. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/pricing" className="text-gray-400 hover:text-gray-600 text-sm">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  {
    icon: "🔔",
    title: "Real-time alerts",
    description:
      "Get notified instantly when competitors change prices, update copy, or launch new features.",
  },
  {
    icon: "🤖",
    title: "AI summaries",
    description:
      "No more reading diffs. Our AI turns raw changes into plain-English insights you can act on.",
  },
  {
    icon: "📊",
    title: "Change history",
    description:
      "Every change is logged and archived. See exactly how a competitor evolved over time.",
  },
  {
    icon: "💰",
    title: "Price tracking",
    description:
      "Automatically detect pricing changes and get alerted before your sales team does.",
  },
  {
    icon: "⚡",
    title: "24/7 monitoring",
    description:
      "Our scraping engine checks your competitors constantly — so you never miss a thing.",
  },
  {
    icon: "🔗",
    title: "API access",
    description:
      "Agency plan includes full API access to pipe alerts into your own tools and dashboards.",
  },
];
