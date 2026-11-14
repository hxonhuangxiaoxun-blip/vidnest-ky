"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Info, Play, Star } from "lucide-react";
import {
  usePublishedHome,
  PublishedHero,
  PublishedSections,
} from "./PublishedHomepage";
import { PromotionVideo } from "./PromotionVideo";
import { useAdvertisementMeasurement } from "./useAdvertisementMeasurement";
import { PageFrame } from "./AppShell";
import { MediaCard, MediaRow } from "./MediaCard";
import { useViewer } from "./ViewerProvider";
import {
  useCatalog,
  type CatalogAd,
  type CatalogDrama,
} from "./CatalogProvider";
import { episodeId } from "@/lib/front-config";
import { Segmented, accessText, accessTone, EmptyState } from "./FrontUi";
import { useLandingCatalog } from "./useLandingCatalog";
import { usePublicDiscovery } from "./usePublicDiscovery";
import {
  useBrowseState,
  BrowseFeedback,
  BrowsePagination,
} from "./PublicBrowse";

type Slide =
  | { key: string; kind: "ad"; ad: CatalogAd }
  | { key: string; kind: "series"; drama: CatalogDrama };

export function FrontHome() {
  const { tr } = useViewer();
  const { ads, settings } = useCatalog();
  const published = usePublishedHome(),
    home = published.data;
  const landing = useLandingCatalog(),
    state = useBrowseState("recommend"),
    sort = state.sort;
  const { data, loading, error, retry } = usePublicDiscovery(
    {
      q: "",
      category: "全部",
      access: "all",
      sort,
      page: state.page,
      resource: "cards",
    },
    state.initialized,
  );
  const recommended = landing.data?.recommended || [],
    latest = landing.data?.latest || [],
    free = landing.data?.free || [];
  const slides: Slide[] = [
    ...ads
      .filter((ad) => ad.slot === "home-hero")
      .map((ad) => ({ key: `ad-${ad.id}`, kind: "ad" as const, ad })),
    ...recommended
      .slice(0, 5)
      .map((drama) => ({
        key: `series-${drama.id}`,
        kind: "series" as const,
        drama,
      })),
  ];
  const resume = landing.data?.resume || [],
    all = data?.series || [];
  return (
    <PageFrame>
      <h1 className="jf-sr-only">{settings.siteTitle}</h1>
      {home?.configured ? (
        <PublishedHero home={home} />
      ) : (
        home &&
        !published.error &&
        slides.length > 0 && <HomeHero slides={slides} />
      )}
      <div className="jf-home-body">
        <nav
          className="jf-pills jf-gutter"
          aria-label={tr("短剧分类", "Categories")}
        >
          <Link href="/" className="jf-pill active" aria-current="page">
            {tr("全部", "All")}
          </Link>
          {(data?.categories || []).map((genre) => (
            <Link
              key={genre}
              href={`/category/${encodeURIComponent(genre)}`}
              className="jf-pill"
            >
              {genre}
            </Link>
          ))}
        </nav>
        <BrowseFeedback
          loading={published.loading}
          error={published.error}
          retry={published.retry}
        />
        <BrowseFeedback
          loading={!landing.data && !landing.error}
          error={landing.error}
          retry={landing.retry}
        />
        {resume.length > 0 && (
          <MediaRow
            title={tr("继续观看", "Continue watching")}
            moreHref="/account?tab=history"
            moreLabel={tr("观看记录", "History")}
          >
            {resume.map((h) => (
              <MediaCard
                key={h.episode}
                drama={h.series}
                href={`/play/episode/${h.episode}`}
                resume={{
                  episode: h.number,
                  percent: h.duration > 0 ? (h.position / h.duration) * 100 : 0,
                }}
              />
            ))}
          </MediaRow>
        )}
        {home?.configured ? (
          <PublishedSections home={home} />
        ) : (
          home &&
          !published.error && (
            <>
              <MediaRow
                title={tr("热门推荐", "Recommended")}
                moreHref="/ranking"
              >
                {recommended.slice(0, 12).map((d, i) => (
                  <MediaCard key={d.id} drama={d} eager={i < 4} />
                ))}
              </MediaRow>
              <MediaRow
                title={tr("新剧上线", "New releases")}
                moreHref="/ranking?tab=latest"
              >
                {latest.slice(0, 12).map((d) => (
                  <MediaCard key={d.id} drama={d} />
                ))}
              </MediaRow>
              {free.length > 0 && (
                <MediaRow
                  title={tr("免费专区", "Free to watch")}
                  moreHref={`/search?access=${encodeURIComponent("免费试看")}`}
                >
                  {free.map((d) => (
                    <MediaCard key={d.id} drama={d} />
                  ))}
                </MediaRow>
              )}
            </>
          )
        )}
        <section className="jf-section">
          <div className="jf-section-head is-wrap">
            <h2 className="jf-section-title">{tr("全部剧集", "All series")}</h2>
            <Segmented
              label={tr("排序方式", "Sort")}
              value={sort}
              onChange={state.changeSort}
              options={[
                { value: "recommend", label: tr("推荐榜", "Picks") },
                { value: "rating", label: tr("评分榜", "Rating") },
                { value: "latest", label: tr("最新上线", "Newest") },
              ]}
            />
          </div>
          <BrowseFeedback loading={loading} error={error} retry={retry} />
          {!loading && !error && (
            <div className="jf-grid">
              {all.map((d) => (
                <MediaCard key={d.id} drama={d} />
              ))}
            </div>
          )}
          {!loading && !error && !all.length && (
            <EmptyState title={tr("暂时没有短剧", "No series yet")} />
          )}
          {!error && (
            <BrowsePagination
              data={data}
              loading={loading}
              onPage={state.setPage}
              label="首页目录"
            />
          )}
        </section>
      </div>
    </PageFrame>
  );
}

function HomeHero({ slides }: { slides: Slide[] }) {
  const { tr } = useViewer();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const count = slides.length;
  const current = index % count;
  const hero = useRef<HTMLElement>(null);
  const measurementAd = slides[current];
  useAdvertisementMeasurement(
    hero,
    measurementAd?.kind === "ad" ? measurementAd.ad.id : undefined,
    "fallback-hero",
  );
  useEffect(() => {
    if (paused || count < 2) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      6000,
    );
    return () => window.clearInterval(timer);
  }, [paused, count]);
  const go = (next: number) => setIndex(((next % count) + count) % count);
  return (
    <section
      ref={hero}
      className="jf-hero"
      aria-roledescription="carousel"
      aria-label={tr("精选推荐", "Featured")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        setPaused(false);
        if (!start) return;
        const dx = e.changedTouches[0].clientX - start.x,
          dy = e.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2)
          go(current + (dx < 0 ? 1 : -1));
      }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.key}
          className={`jf-hero-slide ${i === current ? "active" : ""}`}
          aria-hidden={i !== current}
          inert={i !== current}
        >
          <HeroMedia slide={slide} eager={i === 0} active={i === current} />
          <div className="jf-hero-shade" />
          <div className="jf-hero-copy">
            {slide.kind === "series" ? (
              <>
                <div className="jf-hero-badges">
                  <span className={`jf-badge tone-${accessTone(slide.drama)}`}>
                    {accessText(slide.drama, tr)}
                  </span>
                  <span className="jf-badge is-ghost">{slide.drama.genre}</span>
                </div>
                <h2 className="jf-hero-title">{slide.drama.title}</h2>
                <p className="jf-hero-sub">{slide.drama.subtitle}</p>
                <p className="jf-hero-meta">
                  <span>
                    {tr("共", "")} {slide.drama.episodes} {tr("集", "episodes")}
                  </span>
                  <i />
                  <span className="jf-hero-rating">
                    <Star size={13} fill="currentColor" />{" "}
                    {tr("评分", "Rating")} {slide.drama.rating}
                  </span>
                  <i />
                  <span>{slide.drama.year}</span>
                </p>
                <div className="jf-hero-actions">
                  <Link
                    className="jf-btn jf-btn-primary"
                    href={`/play/episode/${episodeId(slide.drama, 1)}`}
                  >
                    <Play size={17} fill="currentColor" />
                    {tr("立即观看", "Watch now")}
                  </Link>
                  <Link
                    className="jf-btn jf-btn-ghost"
                    href={`/series/${slide.drama.id}`}
                  >
                    <Info size={17} />
                    {tr("了解更多", "More info")}
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="jf-hero-badges">
                  <span className="jf-badge tone-paid">
                    {tr("推广", "Promoted")}
                  </span>
                </div>
                <h2 className="jf-hero-title">{slide.ad.name}</h2>
                {slide.ad.link && (
                  <div className="jf-hero-actions">
                    <a
                      className="jf-btn jf-btn-primary"
                      href={slide.ad.link}
                      target={
                        slide.ad.link.startsWith("/") ? undefined : "_blank"
                      }
                      rel={
                        slide.ad.link.startsWith("/") ? undefined : "noreferrer"
                      }
                    >
                      {tr("了解详情", "Learn more")}
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
      {count > 1 && (
        <>
          <div
            className="jf-hero-dots"
            role="tablist"
            aria-label={tr("切换推荐", "Choose slide")}
          >
            {slides.map((slide, i) => (
              <button
                type="button"
                role="tab"
                key={slide.key}
                aria-selected={i === current}
                aria-label={`${tr("第", "Slide ")}${i + 1}${tr(" 张", "")}`}
                className={i === current ? "active" : ""}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <div className="jf-hero-thumbs" aria-hidden="true">
            {slides.map((slide, i) => (
              <button
                type="button"
                tabIndex={-1}
                key={slide.key}
                className={i === current ? "active" : ""}
                onClick={() => go(i)}
              >
                {slide.kind === "series" ? (
                  <img src={slide.drama.image} alt="" loading="lazy" />
                ) : slide.ad.kind === "image" ? (
                  <img src={slide.ad.asset} alt="" loading="lazy" />
                ) : (
                  <span className="jf-hero-thumb-video">
                    <Play size={16} fill="currentColor" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function HeroMedia({
  slide,
  eager,
  active,
}: {
  slide: Slide;
  eager: boolean;
  active: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!video.current) return;
    if (active) void video.current.play().catch(() => {});
    else video.current.pause();
  }, [active]);
  if (slide.kind === "ad" && slide.ad.kind === "video")
    return (
      <div className="jf-hero-media">
        {active && (
          <PromotionVideo
            advertisementId={slide.ad.id}
            poster={slide.ad.poster}
            className="jf-hero-img"
          />
        )}
      </div>
    );
  const src = slide.kind === "ad" ? slide.ad.asset : slide.drama.image;
  const alt = slide.kind === "ad" ? slide.ad.name : slide.drama.title;
  return (
    <div className="jf-hero-media">
      <img
        className="jf-hero-blur"
        src={src}
        alt=""
        aria-hidden="true"
        loading={eager ? "eager" : "lazy"}
      />
      <img
        className="jf-hero-img"
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
      />
    </div>
  );
}
