"use client";
import Link from "next/link";
import { ChevronLeft, Play, Star } from "lucide-react";
import type { Drama } from "@/lib/content";
import { money } from "@/lib/front-config";
import { useViewer, useViewerScope } from "./ViewerProvider";
import { Interactions } from "./FrontControls";
import { BuyButton } from "./FrontCommerce";
import { accessText, accessTone } from "./FrontUi";
import { EpisodeDirectory } from "./EpisodeDirectory";
export function FrontSeries({
  drama,
  firstEpisode,
}: {
  drama: Drama & { tags?: string[] };
  firstEpisode: { id: string; number: number; title: string } | null;
}) {
  const { tr } = useViewer();
  useViewerScope([drama.id]);
  const tags = [...new Set(drama.tags || [])];
  return (
    <div className="jf-detail">
      <section className="jf-detail-hero">
        <div className="jf-detail-bg" aria-hidden="true">
          <img src={drama.image} alt="" />
        </div>
        <Link className="jf-back" href="/">
          <ChevronLeft size={18} />
          {tr("返回首页", "Home")}
        </Link>
        <div className="jf-detail-main">
          <img
            className="jf-detail-poster"
            src={drama.image}
            alt={drama.title}
          />
          <div className="jf-detail-info">
            <div className="jf-hero-badges">
              <span className={`jf-badge tone-${accessTone(drama)}`}>
                {accessText(drama, tr)}
              </span>
              <span className="jf-badge is-ghost">{drama.genre}</span>
            </div>
            <h1>{drama.title}</h1>
            <p className="jf-detail-meta">
              <span className="jf-hero-rating">
                <Star size={14} fill="currentColor" /> {drama.rating}
              </span>
              <i />
              <span>{drama.year}</span>
              <i />
              <span>
                {tr("已发布", "Published")} {drama.episodes}{" "}
                {tr("集", "episodes")}
              </span>
              <i />
              <span>
                {tr("计划", "Planned")}{" "}
                {drama.plannedEpisodes ?? drama.episodes} {tr("集", "episodes")}
              </span>
            </p>
            <p className="jf-detail-sub">{drama.subtitle}</p>
            <div className="prototype-readonly">
              <h2>{tr("剧情简介", "Synopsis")}</h2>
              <p>
                {drama.description || tr("暂未录入完整简介", "No synopsis yet")}
              </p>
            </div>
            <div className="jf-detail-tags">
              {tags.map((tag) => (
                <span className="jf-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="jf-detail-actions">
              <Link
                className="jf-btn jf-btn-primary"
                href={
                  firstEpisode
                    ? "/play/episode/" + firstEpisode.id
                    : "#published-episodes"
                }
              >
                <Play size={17} fill="currentColor" />
                {firstEpisode
                  ? tr("播放首个已发布集", "Play first published episode")
                  : tr("暂无已发布分集", "No published episodes")}
              </Link>
              {(drama.purchasableEpisodes ?? 0) > 0 &&
                drama.seriesPurchasePriceCents != null && (
                  <BuyButton
                    kind="series"
                    item={drama.id}
                    label={`${tr("购买整部", "Buy series")} ${money(drama.seriesPurchasePriceCents)}`}
                  />
                )}
              {(drama.purchasableEpisodes ?? 0) > 0 &&
                drama.seriesPurchasePriceCents == null && (
                  <p>
                    {tr(
                      "整部购买价格暂未配置",
                      "Series purchase price is not configured",
                    )}
                  </p>
                )}
            </div>
            <p className="jf-detail-note">
              {tr(
                "全部为虚构演示分集，免费体验几何动画。",
                "All episodes are fictional demos with a free geometric animation.",
              )}
            </p>
          </div>
        </div>
      </section>
      <section
        className="jf-section jf-detail-episodes"
        id="published-episodes"
      >
        <div className="jf-section-head">
          <h2 className="jf-section-title">{tr("选集", "Episodes")}</h2>
          <span className="jf-more">
            {tr("已发布", "Published")} {drama.episodes} {tr("集", "episodes")}
          </span>
        </div>
        <EpisodeDirectory series={drama.id} />
        {!drama.episodes && (
          <p>{tr("暂无已发布分集", "No published episodes yet")}</p>
        )}
      </section>
      <Interactions series={drama.id} />
    </div>
  );
}
