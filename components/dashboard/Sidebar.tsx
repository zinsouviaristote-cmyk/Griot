import { SidebarContent } from "@/components/dashboard/SidebarContent";
import { AdminSidebarContent } from "@/components/admin/AdminSidebarContent";

export function Sidebar({
  creditBalance,
  userInitials,
  userName,
  userEmail,
  userPhotoUrl,
}: {
  creditBalance: number;
  userInitials: string;
  userName: string;
  userEmail: string;
  userPhotoUrl?: string | null;
}) {
  const isAdmin = userEmail.trim().toLowerCase() === "zinsouviaristote@gmail.com";
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] shrink-0 border-r border-border bg-surface lg:flex">
      {isAdmin ? (
        <AdminSidebarContent
          creditBalance={creditBalance}
          userInitials={userInitials}
          userName={userName}
          userEmail={userEmail}
          userPhotoUrl={userPhotoUrl}
        />
      ) : (
        <SidebarContent
          creditBalance={creditBalance}
          userInitials={userInitials}
          userName={userName}
          userEmail={userEmail}
          userPhotoUrl={userPhotoUrl}
        />
      )}
    </aside>
  );
}