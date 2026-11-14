import { assetPath } from "./asset-path";
import records from "@/data/catalog.json";
import type { CatalogDrama } from "@/components/CatalogProvider";
export const demoDramas = records.map((d) => ({
  ...d,
  image: assetPath(d.image),
})) as CatalogDrama[];
export const demoCategories = [...new Set(demoDramas.map((d) => d.genre))];
export function discover(f: {
  q: string;
  category: string;
  access: string;
  sort: string;
  page: number;
}) {
  let list = demoDramas.filter(
    (d) =>
      (!f.q ||
        [d.title, d.subtitle, d.genre].some((s) => s.includes(f.q.trim()))) &&
      (f.category === "全部" || d.genre === f.category) &&
      (f.access === "all" || f.access === "free"),
  );
  if (f.sort === "rating")
    list = [...list].sort((a, b) => Number(b.rating) - Number(a.rating));
  if (f.sort === "latest") list = [...list].reverse();
  const pageSize = 8,
    pages = Math.max(1, Math.ceil(list.length / pageSize)),
    page = Math.min(pages, Math.max(1, f.page));
  return {
    series: list.slice((page - 1) * pageSize, page * pageSize),
    categories: demoCategories,
    page,
    pageSize,
    pages,
    total: list.length,
  };
}
