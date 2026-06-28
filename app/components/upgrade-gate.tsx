import { Link } from "@tanstack/react-router";
import { authClient } from "~/lib/auth-client";
import type { ReactNode } from "react";

interface UpgradeGateProps {
  requiredPlan: "pro" | "agency";
  feature: string;
  children: ReactNode;
}

/**
 * Wrap any feature with this component to gate it behind a plan.
 * If the user is on a lower plan, shows an upgrade prompt instead.
 */
export function UpgradeGate({ requiredPlan, feature, children }: UpgradeGateProps) {
  const { data: session } = authClient.useSession();
  const currentPlan = (session?.user as any)?.plan ?? "free";

  const planRank = { free: 0, pro: 1, agency: 2 } as const;
  const hasAccess = planRank[currentPlan as keyof typeof planRank] >= planRank[requiredPlan];

  if (hasAccess) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred preview */}
      <div className="pointer-events-none select-none opacity-30 blur-sm">{children}</div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-xs">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature}</h3>
          <p className="text-gray-500 text-sm mb-5">
            Available on the <span className="capitalize font-semibold">{requiredPlan}</span> plan and above.
          </p>
          <Link
            to="/pricing"
            className="block bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Upgrade →
          </Link>
        </div>
      </div>
    </div>
  );
}
