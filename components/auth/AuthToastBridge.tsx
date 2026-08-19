"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function AuthToastBridge() {
  const router = useRouter();
  const showToast = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const url = new URL(window.location.href);
    const toast = url.searchParams.get("toast");
    if (!toast) return;

    if (toast === "login") showToast(t("auth.loginToast"), "success");
    if (toast === "logout") showToast(t("auth.logoutToast"), "success");

    url.searchParams.delete("toast");
    router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
  }, [router, showToast, t]);

  return null;
}