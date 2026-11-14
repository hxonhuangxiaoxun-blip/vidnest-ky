"use client";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import type { Drama } from "@/lib/content";
import { episodeId, type ViewerState } from "@/lib/front-config";

/** 选集网格：锁定的集数显示锁图标，当前集高亮。 */
export function EpisodeGrid({
  drama,
  state,
  tr,
  current,
  autoplay = false,
  onPick,
  publishedEpisodes,
}: {
  drama: Drama;
  state: ViewerState;
  tr: (zh: string, en: string) => string;
  current?: number;
  autoplay?: boolean;
  onPick?: (n: number, e: React.MouseEvent<HTMLAnchorElement>) => void;
  publishedEpisodes?: Array<{ id: string; number: number; title: string }>;
}) {
  return (
    <div className="jf-episodes">
      {(
        publishedEpisodes ||
        drama.episodeList ||
        Array.from({ length: drama.episodes }, (_, i) => ({
          id: episodeId(drama, i + 1),
          number: i + 1,
          title: "",
        }))
      ).map((episode) => {
        const n = episode.number;
        const allowed = canWatch(drama, n, state);
        return (
          <Link
            key={episode.id}
            href={
              "/play/episode/" + episode.id + (autoplay ? "?autoplay=1" : "")
            }
            className={`jf-ep ${n === current ? "current" : ""} ${allowed ? "" : "locked"}`}
            aria-current={n === current ? "page" : undefined}
            aria-label={`${tr("第", "Episode ")}${n}${tr("集", "")}${allowed ? "" : tr("，需解锁", ", locked")}`}
            onClick={onPick ? (e) => onPick(n, e) : undefined}
          >
            {n}
            {!allowed && <LockKeyhole size={11} aria-hidden="true" />}
          </Link>
        );
      })}
    </div>
  );
}

/** 前台列表常用的排序：推荐（后台排序）、评分、最新上线。 */
type Sortable = Drama & { sort_order?: number; updated?: number };
const order = (d: Sortable) => d.sort_order ?? 0;
export const sorters = {
  recommend: (a: Sortable, b: Sortable) => order(a) - order(b),
  rating: (a: Sortable, b: Sortable) =>
    Number(b.rating) - Number(a.rating) || order(a) - order(b),
  latest: (a: Sortable, b: Sortable) =>
    (b.updated ?? 0) - (a.updated ?? 0) ||
    Number(b.year) - Number(a.year) ||
    order(a) - order(b),
};
export type SortKey = keyof typeof sorters;

export function sortLabel(
  key: SortKey,
  tr: (zh: string, en: string) => string,
) {
  return key === "rating"
    ? tr("评分榜", "Top rated")
    : key === "latest"
      ? tr("最新上线", "Newest")
      : tr("推荐榜", "Recommended");
}

export function episodeRule(drama: Drama, n: number) {
  const override = drama.episodeList?.find((e) => e.number === n)?.access;
  if (override && override !== "inherit") return override;
  return n <= (drama.freeEpisodes ?? 2) || drama.access === "免费试看"
    ? "free"
    : drama.access === "会员专享"
      ? "vip"
      : "paid";
}
export function accessGroup(drama: Drama): Drama["access"] {
  if (drama.accessCounts)
    return drama.accessCounts.paid
      ? "单集购买"
      : drama.accessCounts.vip
        ? "会员专享"
        : "免费试看";
  if (!drama.episodeList?.length) return drama.access;
  const rules = drama.episodeList.map((e) => episodeRule(drama, e.number));
  return rules.every((r) => r === "free")
    ? "免费试看"
    : rules.includes("paid")
      ? "单集购买"
      : "会员专享";
}
export function accessText(
  value: string | Drama,
  tr: (zh: string, en: string) => string,
) {
  if (typeof value !== "string" && value.accessCounts) {
    const counts = value.accessCounts;
    if (counts.paid && counts.vip)
      return tr("按分集解锁", "Episode-specific access");
    if (counts.free && (counts.paid || counts.vip))
      return counts.paid
        ? tr("部分集购买", "Some episodes paid")
        : tr("部分集会员", "Some episodes VIP");
    return accessText(accessGroup(value), tr);
  }
  if (typeof value !== "string" && value.episodeList?.length) {
    const rules = new Set(
      value.episodeList.map((e) => episodeRule(value, e.number)),
    );
    if (rules.has("paid") && rules.has("vip"))
      return tr("按分集解锁", "Episode-specific access");
    if (rules.has("free") && rules.size > 1)
      return rules.has("paid")
        ? tr("部分集购买", "Some episodes paid")
        : tr("部分集会员", "Some episodes VIP");
  }
  const access = typeof value === "string" ? value : accessGroup(value);
  return access === "免费试看"
    ? tr("整部免费", "Free series")
    : access === "会员专享"
      ? tr("会员专享", "VIP")
      : tr("单集购买", "Paid");
}
export function accessTone(value: string | Drama) {
  const access = typeof value === "string" ? value : accessGroup(value);
  return access === "免费试看"
    ? "free"
    : access === "会员专享"
      ? "vip"
      : "paid";
}

/** 继承剧目免费集数和默认规则，分集覆盖优先；会员仅解锁有效 VIP 分集。 */
export function canWatch(drama: Drama, n: number, state: ViewerState) {
  const ep = drama.episodeList?.find((e) => e.number === n);
  if (drama.episodeList && !ep) return false;
  const id = ep?.id || episodeId(drama, n);
  const rule = episodeRule(drama, n);
  return (
    rule === "free" ||
    state.purchases.includes(id) ||
    state.purchases.includes(drama.id) ||
    (rule === "vip" && !!state.user && state.user.memberUntil > Date.now())
  );
}
export function unlockedCount(drama: Drama, state: ViewerState) {
  let count = 0;
  for (const n of drama.episodeList?.map((e) => e.number) ||
    Array.from({ length: drama.episodes }, (_, i) => i + 1))
    if (canWatch(drama, n, state)) count++;
  return count;
}

export function genresOf(dramas: Drama[]) {
  const map = new Map<string, number>();
  dramas.forEach((d) => map.set(d.genre, (map.get(d.genre) || 0) + 1));
  return [...map].map(([genre, count]) => ({ genre, count }));
}

export const isRecent = (updated?: number) =>
  !!updated && Date.now() - updated < 14 * 86400000;

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div className="jf-seg" role="tablist" aria-label={label}>
      {options.map((option) => (
        <button
          type="button"
          role="tab"
          key={option.value}
          aria-selected={value === option.value}
          className={value === option.value ? "active" : ""}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  text,
  children,
  art = "search",
}: {
  title: string;
  text?: string;
  children?: React.ReactNode;
  art?: "search" | "box" | "lock";
}) {
  return (
    <div className="jf-empty">
      <EmptyArt kind={art} />
      <strong>{title}</strong>
      {text && <p>{text}</p>}
      {children && <div className="jf-empty-actions">{children}</div>}
    </div>
  );
}

function EmptyArt({ kind }: { kind: "search" | "box" | "lock" }) {
  return (
    <svg className="jf-empty-art" viewBox="0 0 120 96" aria-hidden="true">
      <ellipse cx="60" cy="86" rx="38" ry="5" fill="#000" opacity=".35" />
      <rect
        x="22"
        y="18"
        width="76"
        height="56"
        rx="14"
        fill="#262626"
        stroke="#3a3a3a"
      />
      <rect x="32" y="30" width="34" height="5" rx="2.5" fill="#464646" />
      <rect x="32" y="41" width="48" height="5" rx="2.5" fill="#383838" />
      <rect x="32" y="52" width="26" height="5" rx="2.5" fill="#383838" />
      {kind === "search" && (
        <g>
          <circle
            cx="80"
            cy="56"
            r="13"
            fill="#0c0c0c"
            stroke="#F19744"
            strokeWidth="4"
          />
          <path
            d="M89.5 65.5 99 75"
            stroke="#F19744"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
      )}
      {kind === "box" && (
        <g>
          <path
            d="M70 46h24v24a6 6 0 0 1-6 6H76a6 6 0 0 1-6-6V46Z"
            fill="#F19744"
          />
          <path d="M67 40h30v8H67z" fill="#FB923C" />
          <path d="M82 40v36" stroke="#0c0c0c" strokeWidth="3" />
        </g>
      )}
      {kind === "lock" && (
        <g>
          <rect x="68" y="50" width="28" height="24" rx="6" fill="#F19744" />
          <path
            d="M74 50v-6a8 8 0 0 1 16 0v6"
            fill="none"
            stroke="#F19744"
            strokeWidth="4"
          />
          <circle cx="82" cy="61" r="3" fill="#0c0c0c" />
        </g>
      )}
    </svg>
  );
}
