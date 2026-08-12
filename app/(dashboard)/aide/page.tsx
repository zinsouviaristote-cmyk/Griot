import type { Metadata } from "next";
import { AidePageBody } from "@/components/settings/AidePageBody";

export const metadata: Metadata = {
  title: "Aide : Griot",
};

export default function AidePage() {
  return <AidePageBody />;
}
