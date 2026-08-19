"use client";

// Interrupteur seul — jamais le conteneur cliquable qui le porte (label, ligne
// de réglage…) : le composer soi-même évite d'imbriquer un contrôle interactif
// dans un autre (un `<button>` autour d'un `role="switch"` n'est pas valide).
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
    >
      <span
        className={`relative flex h-6 w-10 items-center rounded-full border transition-colors duration-200 ${
          checked ? "border-brand bg-brand" : "border-border bg-transparent"
        }`}
      >
        <span
          className={`absolute left-0.5 h-5 w-5 rounded-full border bg-white shadow-card transition-transform duration-200 ease-out group-active:scale-90 ${
            checked ? "translate-x-4 border-brand" : "translate-x-0 border-border"
          }`}
        />
      </span>
    </button>
  );
}
