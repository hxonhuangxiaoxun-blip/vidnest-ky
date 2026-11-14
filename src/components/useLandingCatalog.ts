"use client";
import { demoDramas } from "@/lib/demo-catalog";
export function useLandingCatalog() {
  return {
    data: {
      recommended: demoDramas.slice(0, 8),
      latest: [...demoDramas].reverse().slice(0, 8),
      free: demoDramas.slice(4, 12),
      resume: [] as Array<{
        episode: string;
        number: number;
        position: number;
        duration: number;
        series: (typeof demoDramas)[number];
      }>,
    },
    error: "",
    retry: () => {},
  };
}
