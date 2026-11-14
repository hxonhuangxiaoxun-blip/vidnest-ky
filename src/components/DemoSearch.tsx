"use client";
import { useState } from "react";
import { demoDramas, demoCategories } from "@/lib/demo-catalog";
import { MediaCard } from "./MediaCard";
export function DemoSearch() {
  const [q, setQ] = useState(""),
    [category, setCategory] = useState("全部");
  const list = demoDramas.filter(
    (d) =>
      (!q.trim() ||
        [d.title, d.genre, d.subtitle].some((v) => v.includes(q.trim()))) &&
      (category === "全部" || d.genre === category),
  );
  return (
    <section className="demo-content">
      <h1>搜索演示目录</h1>
      <label className="demo-search">
        剧名或分类
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索，例如：山海、旅行"
        />
      </label>
      <div className="demo-episodes">
        {["全部", ...demoCategories].map((g) => (
          <button
            className={
              "jf-btn " + (g === category ? "jf-btn-primary" : "jf-btn-ghost")
            }
            onClick={() => setCategory(g)}
            key={g}
          >
            {g}
          </button>
        ))}
      </div>
      <p role="status">找到 {list.length} 个虚构条目</p>
      <div className="jf-grid">
        {list.map((d) => (
          <MediaCard key={d.id} drama={d} />
        ))}
      </div>
      {!list.length && <p>没有匹配条目，请换个关键词。</p>}
    </section>
  );
}
