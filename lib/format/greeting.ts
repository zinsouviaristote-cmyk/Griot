type Translate = (key: string) => string;

export function getTimeBasedGreeting(t: Translate, date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return t("dashboard.greeting.morning");
  if (hour >= 12 && hour < 18) return t("dashboard.greeting.afternoon");
  return t("dashboard.greeting.evening");
}
