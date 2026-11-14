"use client";
import { useViewer } from "./ViewerProvider";
export function Interactions({ series }: { series: string }) {
  const { state, toggleFavorite, tr } = useViewer();
  return (
    <section className="demo-interactions">
      <button
        className="jf-btn jf-btn-ghost"
        onClick={() => toggleFavorite(series)}
      >
        {state.favorites.includes(series)
          ? tr("取消收藏", "Unsave")
          : tr("收藏到此浏览器", "Save in this browser")}
      </button>
      <small>收藏仅保存在当前浏览器，不上传服务器。</small>
    </section>
  );
}
