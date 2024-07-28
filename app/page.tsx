import { NextServerPageProps } from "frames.js/next/server";
import Link from "next/link";
import { currentURL } from "./utils";

type State = {
  active: string;
  total_button_presses: number;
};

import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import { createDebugUrl } from "./debug";
import { vercelURL } from "./utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "frames.js starter",
    description: "This is a frames.js starter template",
    other: {
      ...(await fetchMetadata(
        new URL("/frames", vercelURL() || "http://localhost:3000")
      )),
    },
  };
}

// This is a react server component only
export default async function Home({ searchParams }: NextServerPageProps) {
  const url = currentURL("/");

  // then, when done, return next frame
  return <div className="p-4">Toucanrelay client frame.</div>;
}
