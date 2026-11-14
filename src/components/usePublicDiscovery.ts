"use client";
import { discover } from "@/lib/demo-catalog";
export type DiscoveryFilters = {
  q: string;
  category: string;
  access: string;
  sort: string;
  page: number;
  resource?: string;
  mode?: string;
};
export type DiscoveryResult = ReturnType<typeof discover>;
export function usePublicDiscovery(
  filters: DiscoveryFilters,
  enabled: boolean,
) {
  return {
    data: enabled ? discover(filters) : null,
    loading: !enabled,
    error: "",
    retry: () => {},
  };
}
