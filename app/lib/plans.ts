export const PLAN_LIMITS = {
  free:   { competitors: 2,         checkInterval: "weekly",  aiSummary: false, emailAlerts: false },
  pro:    { competitors: 10,        checkInterval: "hourly",  aiSummary: true,  emailAlerts: true  },
  agency: { competitors: Infinity,  checkInterval: "hourly",  aiSummary: true,  emailAlerts: true  },
} as const;

export type Plan = keyof typeof PLAN_LIMITS;

export function canAddCompetitor(plan: Plan, current: number): boolean {
  return current < PLAN_LIMITS[plan].competitors;
}

export function getPlanLabel(plan: Plan): string {
  return { free: "Free", pro: "Pro", agency: "Agency" }[plan];
}
