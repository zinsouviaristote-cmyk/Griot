"use client";

import { ProfileMenu } from "@/components/dashboard/mobile/ProfileMenu";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { mockUser } from "@/lib/data/mock-dashboard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function ProfilPageBody() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-2xl">
      <SectionTitle as="h1" size="lg">
        {t("nav.profile")}
      </SectionTitle>

      <div className="mt-6">
        <ProfileMenu
          initials={mockUser.initials}
          name={mockUser.firstName}
          email={mockUser.email}
          creditBalance={mockUser.creditBalance}
        />
      </div>
    </div>
  );
}
