"use client";
import { useViewer } from "./ViewerProvider";
import { demoDramas } from "@/lib/demo-catalog";
import { MediaCard } from "./MediaCard";
export function DemoAccount() {
  const { state } = useViewer(),
    list = demoDramas.filter((d) => state.favorites.includes(d.id));
  return (
    <section className="demo-content">
      <h1>本机收藏</h1>
      <p>
        仅将条目编号保存到当前浏览器
        localStorage，不注册账号，也不上传个人信息。可在条目详情取消收藏，或清除此站点浏览器数据。
      </p>
      <div className="jf-grid">
        {list.map((d) => (
          <MediaCard key={d.id} drama={d} />
        ))}
      </div>
      {!list.length && <p>暂无收藏，请打开条目并点击“收藏到此浏览器”。</p>}
    </section>
  );
}
