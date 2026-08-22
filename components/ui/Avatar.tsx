import Image from "next/image";

export function Avatar({
  initials,
  avatarUrl,
  size = "md",
}: {
  initials: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  }[size];

  const pixelSize = { sm: 32, md: 40, lg: 56 }[size];

  if (avatarUrl) {
    return (
      <span
        className={`relative inline-flex ${sizeClasses} shrink-0 overflow-hidden rounded-full ring-1 ring-border`}
      >
        <Image
          src={avatarUrl}
          alt=""
          fill
          sizes={`${pixelSize}px`}
          className="object-cover"
          // Repli discret sur les initiales si l'image casse (lien expiré,
          // domaine bloqué...) plutôt qu'un carré brisé du navigateur.
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex ${sizeClasses} shrink-0 items-center justify-center rounded-full bg-brand font-display font-semibold text-white`}
    >
      {initials}
    </span>
  );
}