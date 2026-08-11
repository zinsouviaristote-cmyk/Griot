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
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? "bg-brand" : "bg-border"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-transform duration-200 ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
