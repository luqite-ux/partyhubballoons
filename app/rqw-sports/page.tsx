import type { Metadata } from "next";

import { RqwSportsPage } from "@/components/rqw-sports/rqw-sports-page";

import "./rqw-sports.css";

export const metadata: Metadata = {
  title: "RQW Sports & Recreation Product Collection",
  description:
    "Explore the RQW collection of sports, fitness, outdoor, swimming, fishing, and recreational products.",
  alternates: { canonical: "/rqw-sports" },
};

export default function Page() {
  return <RqwSportsPage />;
}
