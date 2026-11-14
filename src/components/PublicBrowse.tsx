"use client";
import { useEffect, useState } from "react";
import { useViewer } from "./ViewerProvider";
import type { DiscoveryResult } from "./usePublicDiscovery";

export function useBrowseState(defaultSort = "latest") {
  const [sort, setSort] = useState(defaultSort),
    [access, setAccess] = useState("all"),
    [category, setCategory] = useState("全部"),
    [page, setPage] = useState(1),
    [initialized, setInitialized] = useState(false);
  useEffect(() => {
    const sync = () => {
      const p = new URLSearchParams(location.search),
        s = p.get("sort") || p.get("tab") || defaultSort;
      setSort(
        ["latest", "rating", "recommend", "episodes"].includes(s)
          ? s
          : defaultSort,
      );
      const a = p.get("access") || "all",
        old: Record<string, string> = {
          免费试看: "free",
          会员专享: "vip",
          单集购买: "paid",
        };
      setAccess(
        ["all", "free", "vip", "paid"].includes(a) ? a : old[a] || "all",
      );
      setCategory(p.get("category") || "全部");
      const value = Number(p.get("page"));
      setPage(
        Number.isInteger(value) && value > 0 && value <= 1000000 ? value : 1,
      );
      setInitialized(true);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [defaultSort]);
  return {
    sort,
    access,
    category,
    page,
    initialized,
    setPage,
    changeSort: (value: string) => {
      setSort(value);
      setPage(1);
    },
    changeAccess: (value: string) => {
      setAccess(value);
      setPage(1);
    },
    changeCategory: (value: string) => {
      setCategory(value);
      setPage(1);
    },
  };
}

export function BrowseFeedback({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error: string;
  retry: () => void;
}) {
  const { tr } = useViewer();
  if (error)
    return (
      <div role="alert">
        <p>{error}</p>
        <button type="button" className="jf-btn jf-btn-sm" onClick={retry}>
          {tr("重试目录", "Retry catalog")}
        </button>
      </div>
    );
  return loading ? (
    <p role="status">{tr("正在读取剧目…", "Loading series…")}</p>
  ) : null;
}

export function BrowsePagination({
  data,
  loading,
  onPage,
  label,
}: {
  data: DiscoveryResult | null;
  loading: boolean;
  onPage: (page: number) => void;
  label: string;
}) {
  const { tr } = useViewer();
  if (!data || data.pages <= 1) return null;
  return (
    <nav className="jf-section-head" aria-label={label + tr("分页", " pages")}>
      <button
        type="button"
        className="jf-btn jf-btn-sm"
        aria-label={label + tr("上一页", " previous page")}
        disabled={loading || data.page <= 1}
        onClick={() => onPage(data.page - 1)}
      >
        {tr("上一页", "Previous")}
      </button>
      <span aria-live="polite">
        {tr("第", "Page")} {data.page} / {data.pages} · {data.total}
      </span>
      <button
        type="button"
        className="jf-btn jf-btn-sm"
        aria-label={label + tr("下一页", " next page")}
        disabled={loading || data.page >= data.pages}
        onClick={() => onPage(data.page + 1)}
      >
        {tr("下一页", "Next")}
      </button>
    </nav>
  );
}
