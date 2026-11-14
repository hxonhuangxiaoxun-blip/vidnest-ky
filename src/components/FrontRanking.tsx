"use client";
import Link from "next/link";
import { ListVideo, Star, Trophy } from "lucide-react";
import { usePublicDiscovery } from "./usePublicDiscovery";
import {
  useBrowseState,
  BrowseFeedback,
  BrowsePagination,
} from "./PublicBrowse";
import { useViewer } from "./ViewerProvider";
import { useMobileLayout } from "./useMobileLayout";
import { episodeId } from "@/lib/front-config";
import {
  EmptyState,
  Segmented,
  accessText,
  accessTone,
  sortLabel,
  type SortKey,
} from "./FrontUi";

export function FrontRanking() {
  const { tr } = useViewer();
  const mobile = useMobileLayout();
  const state = useBrowseState("recommend"),
    tab = state.sort as SortKey,
    genre = state.category;
  const { data, loading, error, retry } = usePublicDiscovery(
    {
      q: "",
      category: genre,
      access: "all",
      sort: state.sort,
      page: state.page,
      resource: "cards",
    },
    state.initialized,
  );
  const list = data?.series || [],
    genres = data?.categories || [],
    offset = ((data?.page || 1) - 1) * (data?.pageSize || 24);
  return (
    <div className="jf-rank">
      <header className="jf-rank-head">
        <div className="jf-rank-title">
          <span className="jf-rank-icon" aria-hidden="true">
            <Trophy size={26} />
          </span>
          <div>
            <h1>{tr("排行榜", "Rankings")}</h1>
            <p>
              {genre === "全部" ? tr("全部", "All") : genre} ·{" "}
              {sortLabel(tab, tr)} · {data?.total || 0} {tr("部短剧", "series")}
            </p>
          </div>
        </div>
        <Segmented
          label={tr("榜单", "Ranking")}
          value={tab}
          onChange={state.changeSort}
          options={[
            { value: "recommend", label: tr("推荐榜", "Picks") },
            { value: "rating", label: tr("评分榜", "Rating") },
            { value: "latest", label: tr("最新上线", "Newest") },
          ]}
        />
      </header>
      <div
        className="jf-pills"
        role="tablist"
        aria-label={tr("分类筛选", "Category filter")}
      >
        <button
          type="button"
          role="tab"
          aria-selected={genre === "全部"}
          className={`jf-pill ${genre === "全部" ? "active" : ""}`}
          onClick={() => state.changeCategory("全部")}
        >
          {tr("全部", "All")}
        </button>
        {genres.map((g) => (
          <button
            type="button"
            role="tab"
            aria-selected={genre === g}
            key={g}
            className={`jf-pill ${genre === g ? "active" : ""}`}
            onClick={() => state.changeCategory(g)}
          >
            {g}
          </button>
        ))}
      </div>
      <BrowseFeedback loading={loading} error={error} retry={retry} />
      {!loading &&
        !error &&
        (list.length ? (
          <ol className="jf-rank-list" start={offset + 1}>
            {list.map((d, i) => (
              <li key={d.id}>
                <Link
                  href={
                    mobile
                      ? `/play/episode/${episodeId(d, 1)}`
                      : `/series/${d.id}`
                  }
                  className="jf-rank-row"
                >
                  <span
                    className={`jf-rank-no ${offset + i < 3 ? `is-top top-${offset + i + 1}` : ""}`}
                  >
                    {offset + i + 1}
                  </span>
                  <span className="jf-rank-thumb">
                    <img
                      src={d.image}
                      alt=""
                      loading={i < 4 ? "eager" : "lazy"}
                    />
                  </span>
                  <span className="jf-rank-info">
                    <span className="jf-rank-name">
                      <strong>{d.title}</strong>
                      <span className={`jf-badge tone-${accessTone(d)}`}>
                        {accessText(d, tr)}
                      </span>
                    </span>
                    <span className="jf-rank-desc">{d.subtitle}</span>
                    <span className="jf-rank-meta">
                      <span>
                        <ListVideo size={14} />
                        {tr("共", "")} {d.episodes} {tr("集", "eps")}
                      </span>
                      <span className="jf-rank-rating">
                        <Star size={13} fill="currentColor" />
                        {d.rating}
                      </span>
                      <span className="jf-tag">{d.genre}</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState
            title={tr("这个分类暂时没有短剧", "No series in this category yet")}
            art="box"
          />
        ))}
      {!error && (
        <BrowsePagination
          data={data}
          loading={loading}
          onPage={state.setPage}
          label="排行"
        />
      )}
    </div>
  );
}
