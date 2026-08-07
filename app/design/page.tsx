import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Griot — Design system",
  description: "Référence des tokens du design system : couleurs, typographie, rayons, ombres, boutons.",
};

const COLOR_TOKENS = [
  { name: "brand", value: "#630ed4", swatch: "bg-brand", ink: "text-white" },
  { name: "brand-light", value: "#7c3aed", swatch: "bg-brand-light", ink: "text-white" },
  { name: "brand-soft", value: "#eaddff", swatch: "bg-brand-soft", ink: "text-ink" },
  { name: "secondary", value: "#4b41e1", swatch: "bg-secondary", ink: "text-white" },
  { name: "page", value: "#f7f9fb", swatch: "bg-page", ink: "text-ink" },
  { name: "surface", value: "#ffffff", swatch: "bg-surface", ink: "text-ink" },
  { name: "border", value: "rgba(204,195,216,.5)", swatch: "bg-border", ink: "text-ink" },
  { name: "ink", value: "#191c1e", swatch: "bg-ink", ink: "text-white" },
  { name: "ink-muted", value: "#4a4455", swatch: "bg-ink-muted", ink: "text-white" },
  { name: "success", value: "#0e9f6e", swatch: "bg-success", ink: "text-white" },
  { name: "warning", value: "#b45309", swatch: "bg-warning", ink: "text-white" },
  { name: "danger", value: "#ba1a1a", swatch: "bg-danger", ink: "text-white" },
] as const;

const TYPE_SCALE = [
  { name: "display-lg", detail: "48/56 · 800 · Manrope", className: "font-display text-display-lg", sample: "Griot" },
  {
    name: "headline-lg",
    detail: "32/40 · 700 · Manrope",
    className: "font-display text-headline-lg",
    sample: "Créer une nouvelle chanson",
  },
  {
    name: "headline-lg-mobile",
    detail: "28/36 · 700 · Manrope",
    className: "font-display text-headline-lg-mobile",
    sample: "Créer une nouvelle chanson",
  },
  {
    name: "headline-md",
    detail: "24/32 · 600 · Manrope",
    className: "font-display text-headline-md",
    sample: "Dernières chansons",
  },
  {
    name: "body-lg",
    detail: "18/28 · 400 · Hanken Grotesk",
    className: "text-body-lg",
    sample: "Racontez votre histoire, on lui compose une chanson.",
  },
  {
    name: "body-md",
    detail: "16/24 · 400 · Hanken Grotesk",
    className: "text-body-md",
    sample: "Racontez votre histoire, on lui compose une chanson.",
  },
  {
    name: "label-md",
    detail: "14/20 · 600 · Hanken Grotesk",
    className: "text-label-md uppercase tracking-wide",
    sample: "Découvrir",
  },
  { name: "label-sm", detail: "12/16 · 500 · Hanken Grotesk", className: "text-label-sm", sample: "Payée" },
] as const;

const RADII = [
  { name: "control", detail: "8px — boutons, champs", className: "rounded-control" },
  { name: "card", detail: "16px — cartes, conteneurs", className: "rounded-card" },
  { name: "feature", detail: "24px — cartes principales", className: "rounded-feature" },
  { name: "full", detail: "pilule — puces, recherche", className: "rounded-full" },
] as const;

const SHADOWS = [
  { name: "shadow-card", detail: "Niveau 1 — cartes au repos", className: "shadow-card" },
  { name: "shadow-card-hover", detail: "Niveau 2 — cartes au survol, popovers", className: "shadow-card-hover" },
  { name: "shadow-ring-focus", detail: "Anneau de focus clavier", className: "shadow-ring-focus" },
] as const;

function Swatch({ name, value, swatch, ink }: (typeof COLOR_TOKENS)[number]) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
      <div className={`flex h-20 items-end p-3 ${swatch} ${ink}`}>
        <span className="text-label-sm font-medium">{name}</span>
      </div>
      <p className="px-3 py-2 font-mono text-label-sm text-ink-muted">{value}</p>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-page px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-shell space-y-16">
        <header className="flex items-center justify-between border-b border-border pb-6">
          <Logo />
          <span className="text-label-sm text-ink-muted">Design system — référence</span>
        </header>

        {/* Couleurs */}
        <section>
          <SectionTitle>Couleurs</SectionTitle>
          <p className="mt-3 max-w-2xl text-body-md text-ink-muted">
            Un seul violet plein (<code className="font-mono text-label-sm">brand</code>) pour tous les
            boutons principaux et états actifs. <code className="font-mono text-label-sm">brand-light</code>{" "}
            est l&apos;unique variante claire sanctionnée — jamais sur un bouton.{" "}
            <code className="font-mono text-label-sm">secondary</code> est l&apos;indigo rare, réservé à un
            ou deux éléments dans toute l&apos;app.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {COLOR_TOKENS.map((token) => (
              <Swatch key={token.name} {...token} />
            ))}
          </div>
        </section>

        {/* Typographie */}
        <section>
          <SectionTitle>Typographie</SectionTitle>
          <p className="mt-3 max-w-2xl text-body-md text-ink-muted">
            Manrope pour les titres, Hanken Grotesk pour le corps, les labels et les données.
          </p>
          <div className="mt-6 divide-y divide-border rounded-card border border-border bg-surface shadow-card">
            {TYPE_SCALE.map((type) => (
              <div key={type.name} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-baseline sm:gap-6">
                <div className="w-full shrink-0 sm:w-44">
                  <p className="font-mono text-label-sm text-ink">text-{type.name}</p>
                  <p className="text-label-sm text-ink-muted">{type.detail}</p>
                </div>
                <p className={`${type.className} text-ink`}>{type.sample}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rayons */}
        <section>
          <SectionTitle>Rayons</SectionTitle>
          <p className="mt-3 max-w-2xl text-body-md text-ink-muted">
            Trois rayons, un par catégorie d&apos;élément — jamais mélangés au hasard.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {RADII.map((radius) => (
              <div key={radius.name} className="text-center">
                <div className={`h-20 w-full border-2 border-brand bg-brand-soft ${radius.className}`} />
                <p className="mt-2 font-mono text-label-sm text-ink">{radius.name}</p>
                <p className="text-label-sm text-ink-muted">{radius.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ombres */}
        <section>
          <SectionTitle>Ombres</SectionTitle>
          <p className="mt-3 max-w-2xl text-body-md text-ink-muted">
            La profondeur vient de l&apos;écart page/carte et d&apos;une ombre douce — jamais d&apos;une
            translucidité ou d&apos;un flou d&apos;arrière-plan sur les cartes.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {SHADOWS.map((shadow) => (
              <div key={shadow.name} className="text-center">
                <div className={`h-20 w-full rounded-card border border-border bg-surface ${shadow.className}`} />
                <p className="mt-3 font-mono text-label-sm text-ink">{shadow.name}</p>
                <p className="text-label-sm text-ink-muted">{shadow.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Boutons */}
        <section>
          <SectionTitle>Boutons</SectionTitle>
          <p className="mt-3 max-w-2xl text-body-md text-ink-muted">
            Principal : aplat <code className="font-mono text-label-sm">brand</code>, aucun dégradé — le
            survol assombrit (<code className="font-mono text-label-sm">brightness</code>) et agrandit
            légèrement, sans halo. Les états ci-dessous sont réels : survolez, cliquez, et comparez au
            désactivé.
          </p>
          <div className="mt-6 space-y-8 rounded-card border border-border bg-surface p-6 shadow-card sm:p-8">
            {(["primary", "secondary", "ghost"] as const).map((variant) => (
              <div key={variant}>
                <p className="mb-3 font-mono text-label-sm uppercase tracking-wide text-ink-muted">
                  {variant}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-center">
                    <Button variant={variant}>Recharger</Button>
                    <p className="mt-2 text-label-sm text-ink-muted">par défaut / survol / actif</p>
                  </div>
                  <div className="text-center">
                    <Button variant={variant} disabled>
                      Recharger
                    </Button>
                    <p className="mt-2 text-label-sm text-ink-muted">désactivé</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
