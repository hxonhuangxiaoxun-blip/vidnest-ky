"use client";
import Link from "next/link";
import { demoDramas } from "@/lib/demo-catalog";
export function EpisodeDirectory({
  series,
  current,
}: {
  series: string;
  current?: number;
}) {
  const drama = demoDramas.find((d) => d.id === series);
  return (
    <nav className="demo-episodes" aria-label="演示选集">
      {drama?.episodeList?.map((ep) => (
        <Link
          className={`jf-btn ${current === ep.number ? "jf-btn-primary" : "jf-btn-ghost"}`}
          aria-current={current === ep.number ? "page" : undefined}
          key={ep.id}
          href={"/play/episode/" + ep.id}
        >
          {ep.title}
        </Link>
      ))}
    </nav>
  );
}
