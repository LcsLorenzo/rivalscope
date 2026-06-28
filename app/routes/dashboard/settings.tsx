import { createFileRoute }   from "@tanstack/react-router";
import { useState }          from "react";
import { authClient }        from "~/lib/auth-client";
import { openBillingPortal } from "~/server/billing";
import { useToast }          from "~/components/toast";
import { useNavigate }       from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({ component: SettingsPage });

function SettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const toast    = useToast();
  const navigate = useNavigate();
  const plan     = (session?.user as any)?.plan ?? "free";

  async function handleBillingPortal() {
    setLoading(true);
    try {
      const { url } = await openBillingPortal();
      window.location.href = url;
    } catch (err: any) {
      toast.error("Billing portal unavailable", err?.message ?? "Please upgrade first");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await authClient.signOut();
    navigate({ to: "/" });
  }

  if (isPending) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

      {/* Profile */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xl font-bold text-white">
            {session?.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{session?.user?.name}</p>
            <p className="text-gray-500 text-sm">{session?.user?.email}</p>
            <span className={`inline-flex items-center mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
              plan === "agency" ? "bg-purple-100 text-purple-700" :
              plan === "pro"    ? "bg-indigo-100 text-indigo-700" :
                                  "bg-gray-100 text-gray-600"
            }`}>
              {plan.charAt(0).toUpperCase() + plan.slice(1)} plan
            </span>
          </div>
        </div>
      </section>

      {/* Billing */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Billing</h2>
        <p className="text-gray-500 text-sm mb-4">Manage your subscription, invoices, and payment method.</p>
        {plan === "free" ? (
          <a href="/pricing" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
            ⭐ Upgrade to Pro
          </a>
        ) : (
          <button
            onClick={handleBillingPortal}
            disabled={loading}
            className="inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Opening…" : "Manage billing →"}
          </button>
        )}
      </section>

      {/* Danger zone */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/50 p-6">
        <h2 className="font-semibold text-red-600 mb-1">Danger zone</h2>
        <p className="text-gray-500 text-sm mb-4">These actions are irreversible. Please be careful.</p>
        <button
          onClick={handleSignOut}
          className="text-sm border border-red-200 dark:border-red-800 text-red-600 px-5 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition font-medium"
        >
          Sign out
        </button>
      </section>
    </div>
  );
}
