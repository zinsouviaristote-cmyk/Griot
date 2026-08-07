import Link from "next/link";
import { Bell, Music2, Plus } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { AvatarMenu } from "@/components/dashboard/mobile/AvatarMenu";

export function MobileTopBar({
  creditBalance,
  userInitials,
  userName,
  userEmail,
}: {
  creditBalance: number;
  userInitials: string;
  userName: string;
  userEmail: string;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-border bg-page/95 px-4 py-2.5 lg:hidden">
      <Link href="/" aria-label="Accueil Griot">
        <Logo withWordmark={false} />
      </Link>

      <div className="flex items-center gap-2">
        {/* La pastille de crédits est l'élément le plus important de cette barre :
            c'est ce qui ramène l'utilisateur ouvrir l'app. */}
        <Link
          href="/recharger"
          className="flex items-center gap-1.5 rounded-full bg-brand-soft py-1 pl-3 pr-1 text-sm font-semibold text-brand"
        >
          <Music2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          {creditBalance}
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-vivid text-white"
            aria-hidden="true"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
        </Link>

        <button
          type="button"
          aria-label="Notifications"
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-brand-soft/60"
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </button>

        <AvatarMenu initials={userInitials} name={userName} email={userEmail} />
      </div>
    </header>
  );
}
