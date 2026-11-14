"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { usePublicDiscovery } from "./usePublicDiscovery";
import {
  useBrowseState,
  BrowseFeedback,
  BrowsePagination,
} from "./PublicBrowse";
import { useViewer } from "./ViewerProvider";
import { MediaCard } from "./MediaCard";
import { EmptyState, Segmented } from "./FrontUi";
export function FrontCategory({ category }: { category: string }) {
  const { tr } = useViewer();
  const state = useBrowseState(),
    { access, sort } = state;
  const { data, loading, error, retry } = usePublicDiscovery(
    { q: "", category, access, sort, page: state.page, resource: "cards" },
    state.initialized,
  );
  const items = data?.series || [],
    genres = data?.categories || [];
  return (
    <div className="jf-category">
      <nav className="jf-pills" aria-label={tr("短剧分类", "Categories")}>
        <Link href="/" className="jf-pill">
          {tr("全部", "All")}
        </Link>
        {genres.map((genre) => (
          <Link
            key={genre}
            href={`/category/${encodeURIComponent(genre)}`}
            className={`jf-pill ${genre === category ? "active" : ""}`}
            aria-current={genre === category ? "page" : undefined}
          >
            {genre}
          </Link>
        ))}
      </nav>
      <div className="jf-category-head">
        <div>
          <Link className="jf-back" href="/search">
            <ChevronLeft size={18} />
            {tr("搜索全部短剧", "Search all")}
          </Link>
          <h1 className="page-title">{category}</h1>
          <p className="jf-search-count">
            {data?.total || 0} {tr("部短剧", "series")}
          </p>
        </div>
        <div className="jf-category-tools">
          <div
            className="jf-pills"
            role="group"
            aria-label={tr("观看类型", "Access type")}
          >
            {["all", "free", "vip", "paid"].map((a) => (
              <button
                type="button"
                key={a}
                className={`jf-pill ${access === a ? "active" : ""}`}
                aria-pressed={access === a}
                onClick={() => state.changeAccess(a)}
              >
                {a === "all"
                  ? tr("全部", "All")
                  : a === "free"
                    ? tr("整部免费", "Free series")
                    : a === "vip"
                      ? tr("会员专享", "VIP")
                      : tr("含购买分集", "Paid episodes")}
              </button>
            ))}
          </div>
          <Segmented
            label={tr("排序", "Sort")}
            value={sort}
            onChange={state.changeSort}
            options={[
              { value: "latest", label: tr("最新优先", "Newest") },
              { value: "rating", label: tr("评分优先", "Top rated") },
            ]}
          />
        </div>
      </div>
      <BrowseFeedback loading={loading} error={error} retry={retry} />
      {!loading &&
        !error &&
        (items.length ? (
          <div className="jf-grid">
            {items.map((d) => (
              <MediaCard key={d.id} drama={d} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={tr("该筛选暂无内容", "No matching series")}
            art="box"
          >
            <button
              type="button"
              className="jf-btn jf-btn-primary jf-btn-sm"
              onClick={() => state.changeAccess("all")}
            >
              {tr("查看全部", "Show all")}
            </button>
          </EmptyState>
        ))}
      {!error && (
        <BrowsePagination
          data={data}
          loading={loading}
          onPage={state.setPage}
          label="分类"
        />
      )}
    </div>
  );
}
