export const plans = [
  { id: "month", name: "月度会员", cents: 1800, days: 30 },
  { id: "quarter", name: "季度会员", cents: 4800, days: 90 },
  { id: "year", name: "年度会员", cents: 13800, days: 365 },
];
// Local sandbox defaults, not final operating prices.
export const episodeCents = 600;
export const money = (cents: number) => `¥${(cents / 100).toFixed(2)}`;
export const episodeId = (
  series:
    | string
    | {
        id: string;
        episodeList?: Array<{ id: string; number: number }>;
        firstEpisode?: { id: string; number: number } | null;
      },
  n: number,
) => {
  if (typeof series !== "string" && series.episodeList)
    return (
      (n === 1
        ? series.episodeList[0]
        : series.episodeList.find((e) => e.number === n)
      )?.id || ""
    );
  if (typeof series !== "string" && "firstEpisode" in series)
    return n === 1 || n === series.firstEpisode?.number
      ? series.firstEpisode?.id || ""
      : "";
  return (
    (typeof series === "string" ? series : series.id) +
    "-" +
    String(n).padStart(2, "0")
  );
};
export type Viewer = {
  id: string;
  email: string;
  nickname: string;
  bio: string;
  avatar: string;
  invite: string;
  created: number;
  balance: number;
  memberUntil: number;
  prefs: {
    language: "zh" | "en";
    notifications: boolean;
    history: boolean;
    publicFavorites: boolean;
    autoplay: boolean;
  };
};
export type ViewerState = {
  unreadNotifications?: number;
  user: Viewer | null;
  favorites: string[];
  likes: string[];
  history: {
    episode: string;
    position: number;
    duration: number;
    updated: number;
  }[];
  purchases: string[];
  notifications: { id: string; text: string; created: number; read: number }[];
  sessions: { id: string; device: string; created: number; current: boolean }[];
};
