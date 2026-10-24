import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { BusinessOffer } from "@/components/home/BusinessOffer";
import { CareersTeaser } from "@/components/home/CareersTeaser";
import { Categories } from "@/components/home/Categories";
import { Hero } from "@/components/home/Hero";
import { HistoryStrip } from "@/components/home/HistoryStrip";
import { Production } from "@/components/home/Production";
import { SalesNetwork } from "@/components/home/SalesNetwork";

export const metadata: Metadata = {
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutTeaser />
      <Categories />
      <BusinessOffer />
      <Production />
      <HistoryStrip />
      <SalesNetwork />
      <CareersTeaser />
    </>
  );
}
