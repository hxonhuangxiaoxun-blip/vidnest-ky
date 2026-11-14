export type Drama = {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  episodes: number;
  rating: string;
  genre: string;
  access: "免费试看" | "会员专享" | "单集购买";
  image: string;
  progress?: number;
  description?: string;
  plannedEpisodes?: number;
  freeEpisodes?: number;
  priceCents?: number | null;
  accessCounts?: { free: number; vip: number; paid: number };
  seriesPurchasePriceCents?: number | null;
  purchasableEpisodes?: number;
  episodeList?: Array<{
    id: string;
    number: number;
    title: string;
    access: string;
    previewSeconds: number;
    priceCents: number | null;
  }>;
  firstEpisode?: {
    id: string;
    number: number;
    title: string;
    access: string;
    previewSeconds: number;
    priceCents: number | null;
  } | null;
};
