"use client";
import type { Drama } from "@/lib/content";
import { demoDramas } from "@/lib/demo-catalog";
export type CatalogDrama = Drama & {
  tags: string[];
  status: string;
  sort_order: number;
  updated: number;
};
export type CatalogAd = {
  id: string;
  name: string;
  kind: "image" | "video";
  asset: string;
  poster?: string;
  link: string;
  slot: string;
  region: string;
  start_at: number;
  end_at: number;
  weight: number;
  status: string;
};
const settings = {
  siteTitle: "VidNest",
  siteNotice: "纯前端学习演示：虚构数据，无登录、支付或业务服务。",
  siteNoticeEnabled: true,
  prices: { month: 0, quarter: 0, year: 0, episode: 0 },
};
export function CatalogProvider({ children }: { children: React.ReactNode }) {
  return children;
}
export function useCatalog() {
  return { dramas: demoDramas, ads: [] as CatalogAd[], settings, ready: true };
}
