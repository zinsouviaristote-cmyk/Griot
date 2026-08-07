import { SidebarContent } from "@/components/dashboard/SidebarContent";

export function Sidebar({ creditBalance }: { creditBalance: number }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] shrink-0 border-r border-border bg-surface lg:flex">
      <SidebarContent creditBalance={creditBalance} />
    </aside>
  );
}
