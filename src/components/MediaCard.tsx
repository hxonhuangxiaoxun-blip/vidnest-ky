"use client";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import type { Drama } from "@/lib/content";
import { useViewer } from "./ViewerProvider";
import { useMobileLayout } from "./useMobileLayout";
import { episodeId } from "@/lib/front-config";
import { accessText, accessTone, isRecent } from "./FrontUi";

type CardDrama = Drama & { updated?: number };

export function MediaCard({
  drama,
  href,
  resume,
  eager = false,
}: {
  drama: CardDrama;
  href?: string;
  resume?: { episode: number; percent: number };
  eager?: boolean;
}) {
  const { tr } = useViewer();
  const mobile = useMobileLayout();
  const progress = resume ? Math.min(100, Math.max(0, resume.percent)) : 0;
  return (
    <Link
      href={
        href ||
        (mobile
          ? `/play/episode/${episodeId(drama, 1)}`
          : `/series/${drama.id}`)
      }
      className="jf-card"
    >
      <span className="jf-card-poster">
        <img
          src={drama.image}
          alt={drama.title}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
        <span className="jf-card-shade" />
        <span className={`jf-badge jf-card-badge tone-${accessTone(drama)}`}>
          {accessText(drama, tr)}
        </span>
        {isRecent(drama.updated) && <span className="jf-card-new">NEW</span>}
        <span className="jf-card-play" aria-hidden="true">
          <Play size={20} fill="currentColor" />
        </span>
        <span className="jf-card-info">
          <span className="jf-card-title">{drama.title}</span>
          <span className="jf-card-meta">
            {resume ? (
              <span>
                {tr("看到第", "Episode")} {resume.episode} {tr("集", "")} ·{" "}
                {Math.round(progress)}%
              </span>
            ) : (
              <>
                <span>
                  {tr("共", "")} {drama.episodes} {tr("集", "eps")}
                </span>
                <i />
                <span className="jf-card-rating">
                  <Star size={10} fill="currentColor" />
                  {drama.rating}
                </span>
              </>
            )}
          </span>
        </span>
        {resume && (
          <span className="jf-card-progress">
            <span style={{ width: `${progress}%` }} />
          </span>
        )}
      </span>
      <span className="jf-card-foot">
        <span className="jf-tag">{drama.genre}</span>
      </span>
    </Link>
  );
}

/** 横向滑动的内容行；电脑端悬停出现左右箭头。 */
export function MediaRow({
  title,
  moreHref,
  moreLabel,
  children,
}: {
  title: string;
  moreHref?: string;
  moreLabel?: string;
  children: React.ReactNode;
}) {
  const { tr } = useViewer();
  const scroller = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => {
    const el = scroller.current;
    if (el)
      el.scrollBy({
        left: direction * el.clientWidth * 0.85,
        behavior: "smooth",
      });
  };
  return (
    <section className="jf-section">
      <div className="jf-section-head">
        <h2 className="jf-section-title">{title}</h2>
        {moreHref && (
          <Link className="jf-more" href={moreHref}>
            {moreLabel || tr("查看更多", "More")}
            <ChevronRight size={15} />
          </Link>
        )}
      </div>
      <div className="jf-row-wrap">
        <button
          type="button"
          className="jf-row-arrow is-left"
          aria-label={tr("向左滚动", "Scroll left")}
          onClick={() => scroll(-1)}
        >
          <ChevronLeft size={22} />
        </button>
        <div className="jf-row" ref={scroller}>
          {children}
        </div>
        <button
          type="button"
          className="jf-row-arrow is-right"
          aria-label={tr("向右滚动", "Scroll right")}
          onClick={() => scroll(1)}
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
}
