"use client";

import { ProfileMenu } from "@/components/dashboard/mobile/ProfileMenu";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useDashboardUser } from "@/lib/auth/DashboardUserContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function ProfilPageBody() {
  const { t } = useLanguage();
  const user = useDashboardUser();
  return (
    <div className="mx-auto max-w-2xl">
      <SectionTitle as="h1" size="lg">
        {t("nav.profile")}
      </SectionTitle>

      <div className="mt-6">
        <ProfileMenu
          initials={user.initials}
          name={user.firstName}
          email={user.email}
          creditBalance={user.creditBalance}
        />
      </div>
    </div>
  );
}
