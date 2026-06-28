import { createFileRoute, Link } from "@tanstack/react-router";
import { ThemeToggle } from "~/components/theme-toggle";
import { pageMeta, FAQ_JSON_LD } from "~/lib/seo";

export const Route = createFileRoute("/")({ 
  head: () => ({
    meta: pageMeta({
      title: "RivalScope — AI Competitor Monitoring",
      description: "Monitor your competitors 24/7. Get AI-powered alerts the moment they change pricing, launch features, or update messaging. Start free, no credit card.",
    }),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(FAQ_JSON_LD) }],
  }),
  component: LandingPage,
});

const FEATURES = [
  { icon: "🔔", title: "Real-time alerts",     desc: "Instant notifications when competitors change prices, update copy, or launch new features." },
  { icon: "🤖", title: "AI summaries",        desc: "GPT-4o turns raw diffs into plain-English insights you can act on in seconds." },
  { icon: "💰", title: "Price tracking",      desc: "Automatic detection of any pricing changes across your competitive landscape." },
  { icon: "⚡",    title: "24/7 monitoring",    desc: "Our engine checks your competitors hourly — even while you sleep." },
  { icon: "📈", title: "Change history",     desc: "Every change is archived. See exactly how any competitor evolved over time." },
  { icon: "🔗", title: "API access",         desc: "Pipe alerts into Slack, Notion, or your own tools via our REST API (Agency plan)." },
];

const TESTIMONIALS = [
  {
    name: "Sarah K.",
    role: "Head of Product @ Growthly",
    avatar: "S",
    color: "bg-pink-100 text-pink-600",
    quote: "RivalScope saved us from a pricing disaster. We caught a competitor's 40% price drop within the hour and adjusted ours the same day.",
  },
  {
    name: "Marc D.",
    role: "Founder @ LaunchFast",
    avatar: "M",
    color: "bg-blue-100 text-blue-600",
    quote: "The AI summaries are genuinely useful. Instead of reading a diff, I get a 2-sentence briefing. I check RivalScope every morning.",
  },
  {
    name: "Priya R.",
    role: "Marketing Director @ Scaleit",
    avatar: "P",
    color: "bg-green-100 text-green-600",
    quote: "We monitor 8 competitors in our Agency plan. The ROI is ridiculous — one caught feature launch helped us plan our Q3 roadmap.",
  },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Add a competitor",     desc: "Paste their URL. We handle the rest." },
  { step: "2", title: "We scan 24/7",          desc: "Our engine monitors their site every hour for any changes." },
  { step: "3", title: "Get instant alerts",   desc: "AI summarizes what changed and why it matters to you." },
];

const FAQS = [
  { q: "How quickly do I get alerted?",        a: "Pro and Agency plans get alerts within 1 hour of a change. Free plans get a weekly digest." },
  { q: "What kind of changes do you detect?",   a: "Pricing, page copy, new pages, removed pages, CTA changes, and more." },
  { q: "Do you support SPAs (React/Next apps)?", a: "Yes. Our scraper renders JavaScript before snapshotting, so no change goes undetected." },
  { q: "Is there a free trial?",                 a: "All paid plans include a 14-day free trial. No credit card required." },
  { q: "Can I cancel anytime?",                  a: "Absolutely. Cancel in one click from your settings page. No questions asked." },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* ── NAV ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="text-2xl">🔍</span>
            <span className="font-bold text-xl">RivalScope</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features"     className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">How it works</a>
            <Link to="/pricing"     className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Pricing</a>
            <Link to="/changelog"   className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Changelog</Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/auth/login" className="hidden md:block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
              Sign in
            </Link>
            <Link
              to="/auth/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm"
            >
              Start free
            </Link>
          </div>
        </nav>
      </header>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        {/* Social proof pill */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium px-4 py-1.5 rounded-full mb-8 border border-indigo-100 dark:border-indigo-800">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Monitoring 10,000+ competitors for 2,400+ teams
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
          Know every move<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            your competitors make
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          RivalScope watches competitor websites 24/7 and sends instant
          <strong className="text-gray-700 dark:text-gray-200"> AI-powered alerts</strong> when
          they change pricing, launch features, or shift their messaging.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap mb-6">
          <Link
            to="/auth/register"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition shadow-xl shadow-indigo-200 dark:shadow-indigo-900"
          >
            Start monitoring for free
            <span aria-hidden>→</span>
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-2xl text-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            ▶️ See how it works
          </a>
        </div>
        <p className="text-gray-400 text-sm">
          ✔ Free forever  ·  ✔ No credit card  ·  ✔ 14-day Pro trial
        </p>

        {/* Product preview */}
        <div className="mt-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl border border-indigo-100 dark:border-gray-700 p-1 shadow-2xl shadow-indigo-100 dark:shadow-none">
          <div className="bg-white dark:bg-gray-900 rounded-[20px] p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-400 font-mono">rivalscope.com/dashboard</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Competitors", value: "8",   icon: "🔍" },
                { label: "Alerts",      value: "24",  icon: "🔔" },
                { label: "Changes",     value: "142", icon: "⚡" },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-left">
                  <div className="text-lg">{s.icon}</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                { name: "Notion",  type: "💰 Price change",   time: "2m ago",  new_: true  },
                { name: "Linear",  type: "🆕 New feature page", time: "1h ago",  new_: true  },
                { name: "Vercel",  type: "📝 Content update",   time: "3h ago",  new_: false },
              ].map((alert) => (
                <div key={alert.name} className={`flex items-center gap-3 p-3 rounded-xl border ${
                  alert.new_ ? "border-indigo-200 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-900/10" : "border-gray-100 dark:border-gray-800"
                }`}>
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-sm font-bold text-indigo-600">
                    {alert.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.name}</p>
                    <p className="text-xs text-gray-500">{alert.type}</p>
                  </div>
                  <span className="text-xs text-gray-400">{alert.time}</span>
                  {alert.new_ && <span className="w-2 h-2 bg-indigo-500 rounded-full" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGOS (social proof) ──────────────────────────── */}
      <section className="border-y border-gray-100 dark:border-gray-800 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-center text-sm text-gray-400 mb-8">Teams at leading companies trust RivalScope</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 dark:opacity-30 grayscale">
            {["Stripe", "Notion", "Linear", "Vercel", "Figma", "Loom"].map((co) => (
              <span key={co} className="text-lg font-bold text-gray-600 dark:text-gray-400">{co}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Up and running in 2 minutes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="text-center">
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-5">
                {step.step}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section id="features" className="bg-gray-50 dark:bg-gray-900 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Everything you need to stay ahead</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md transition group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Loved by product & growth teams</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col gap-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-1">
                “{t.quote}”
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${t.color}`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="bg-gray-50 dark:bg-gray-900 py-24">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
          Ready to outpace the competition?
        </h2>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto">
          Join 2,400+ teams who never miss a competitor move.
        </p>
        <Link
          to="/auth/register"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl text-xl font-bold transition shadow-xl shadow-indigo-200 dark:shadow-indigo-900"
        >
          Get started — it's free
          <span aria-hidden>→</span>
        </Link>
        <p className="text-gray-400 text-sm mt-4">✔ No credit card  ·  ✔ 14-day Pro trial  ·  ✔ Cancel anytime</p>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔍</span>
                <span className="font-bold text-lg">RivalScope</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">AI competitor monitoring for product and growth teams.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">Product</p>
              <ul className="space-y-2">
                {["Features", "Pricing", "Changelog", "Roadmap"].map((l) => (
                  <li key={l}><a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm transition">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">Company</p>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Contact"].map((l) => (
                  <li key={l}><a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm transition">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">Legal</p>
              <ul className="space-y-2">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
                  <li key={l}><a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm transition">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex items-center justify-between flex-wrap gap-4">
            <p className="text-gray-400 text-sm">© 2026 RivalScope. All rights reserved.</p>
            <p className="text-gray-400 text-sm">Built with ❤️ using TanStack Start</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        <span className="font-semibold text-gray-900 dark:text-white text-sm">{q}</span>
        <span className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="px-6 pb-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
