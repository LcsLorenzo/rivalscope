import { Link }   from "@tanstack/react-router";
import type { ReactNode } from "react";

export function UpgradeGate({
  children,
  feature,
  requiredPlan = "Pro",
}: {
  children: ReactNode;
  feature: string;
  requiredPlan?: string;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm opacity-50">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-700 rounded-2xl p-6 text-center shadow-xl max-w-xs mx-4">
          <div className="text-3xl mb-3">🔒</div>
          <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">{requiredPlan} feature</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">{feature} is available on {requiredPlan} and above.</p>
          <Link to="/pricing" className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition">
            Upgrade to {requiredPlan} →
          </Link>
        </div>
      </div>
    </div>
  );
}
