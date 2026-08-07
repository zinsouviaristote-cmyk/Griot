export function Avatar({
  initials,
  size = "md",
}: {
  initials: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  }[size];

  return (
    <span
      className={`inline-flex ${sizeClasses} shrink-0 items-center justify-center rounded-full bg-gradient-signature font-display font-semibold text-paper-100 ring-2 ring-ink-950`}
    >
      {initials}
    </span>
  );
}
