import type { Metadata } from "next";
import { StatistiquesPageBody } from "@/components/dashboard/stats/StatistiquesPageBody";

export const metadata: Metadata = {
  title: "Statistiques : Griot",
};

export default function StatistiquesPage({ searchParams }: { searchParams: { vide?: string } }) {
  return <StatistiquesPageBody isEmptyPreview={searchParams.vide === "1"} />;
}
