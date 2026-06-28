import type { UserProfile } from "../../drizzle/schema";

const PLAN_STYLES: Record<string, string> = {
  free:   "bg-gray-100 text-gray-600",
  pro:    "bg-indigo-100 text-indigo-700",
  agency: "bg-purple-100 text-purple-700",
};

export function PlanBadge({ plan }: { plan: UserProfile["plan"] }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${PLAN_STYLES[plan] ?? PLAN_STYLES["free"]}`}>
      {plan}
    </span>
  );
}
