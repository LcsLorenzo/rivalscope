import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { openBillingPortal, createCheckout } from "~/server/billing";
import { authClient } from "~/lib/auth-client";

export const Route = createFileRoute("/dashboard/settings")({ component: SettingsPage });

function SettingsPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [billingLoading, setBillingLoading] = useState(false);

  const plan = (session?.user as any)?.plan ?? "free";

  async function handleUpgrade(targetPlan: "pro" | "agency") {
    setBillingLoading(true);
    try {
      const { url } = await createCheckout({ data: { plan: targetPlan } });
      if (url) window.location.href = url;
    } finally {
      setBillingLoading(false);
    }
  }

  async function handleBillingPortal() {
    setBillingLoading(true);
    try {
      const { url } = await openBillingPortal();
      if (url) window.location.href = url;
    } finally {
      setBillingLoading(false);
    }
  }

  async function handleSignOut() {
    await authClient.signOut();
    router.navigate({ to: "/" });
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* Profile */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-2xl font-bold text-indigo-600">
            {session?.user?.name?.charAt(0) ?? session?.user?.email?.charAt(0) ?? "?"}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{session?.user?.name ?? "Anonymous"}</p>
            <p className="text-gray-500 text-sm">{session?.user?.email}</p>
            <span className="inline-block mt-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-2 py-0.5 rounded-full capitalize">
              {plan} plan
            </span>
          </div>
        </div>
      </section>

      {/* Billing */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Billing</h2>
        <p className="text-gray-500 text-sm mb-6">Manage your subscription and payment method.</p>

        {plan === "free" ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">You\'re currently on the free plan.</p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleUpgrade("pro")}
                disabled={billingLoading}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                Upgrade to Pro — $29/mo
              </button>
              <button
                onClick={() => handleUpgrade("agency")}
                disabled={billingLoading}
                className="border border-gray-200 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Agency — $99/mo
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You\'re on the <span className="font-semibold capitalize text-indigo-600">{plan}</span> plan.
            </p>
            <button
              onClick={handleBillingPortal}
              disabled={billingLoading}
              className="border border-gray-200 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
            >
              {billingLoading ? "Loading..." : "Manage billing →"}
            </button>
          </div>
        )}
      </section>

      {/* Danger zone */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-red-100 dark:border-red-900/30 p-6">
        <h2 className="font-semibold text-red-600 mb-4">Danger zone</h2>
        <button
          onClick={handleSignOut}
          className="border border-red-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition"
        >
          Sign out
        </button>
      </section>
    </div>
  );
}
