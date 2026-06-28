import { PLAN_LIMITS } from "./stripe";
import type { User } from "./schema";

export function getPlanLimit(plan: User["plan"]) {
  return PLAN_LIMITS[plan];
}

export function canAddCompetitor(currentCount: number, plan: User["plan"]) {
  return currentCount < PLAN_LIMITS[plan].competitors;
}

export function isProOrHigher(plan: User["plan"]) {
  return plan === "pro" || plan === "agency";
}

export function isAgency(plan: User["plan"]) {
  return plan === "agency";
}
