"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Drama } from "@/lib/content";
import { EpisodeDirectory } from "./EpisodeDirectory";
import { Interactions } from "./FrontControls";
export function DemoPlayer({ drama, n }: { drama: Drama; n: number }) {
  const canvas = useRef<HTMLCanvasElement>(null),
    [playing, setPlaying] = useState(false),
    [seconds, setSeconds] = useState(0),
    [supported, setSupported] = useState(true);
  useEffect(() => {
    if (!playing) return;
    let frame = 0,
      start = performance.now(),
      last = 0;
    setSeconds(0);
    const el = canvas.current,
      ctx = el?.getContext("2d");
    if (!el || !ctx) {
      setSupported(false);
      setPlaying(false);
      return;
    }
    function draw(now: number) {
      if (!ctx || !el) return;
      const t = (now - start) / 1000,
        g = ctx.createLinearGradient(0, 0, 960, 540);
      g.addColorStop(0, "#142b4c");
      g.addColorStop(1, "#485f88");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 960, 540);
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.arc(
          480 + Math.sin(t * 0.6 + i) * 320,
          270 + Math.cos(t * 0.4 + i) * 160,
          30 + i * 9,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `hsla(${180 + i * 22},70%,70%,0.35)`;
        ctx.fill();
      }
      ctx.fillStyle = "white";
      ctx.font = "bold 42px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("VIDNEST · DEMO", 480, 250);
      ctx.font = "22px sans-serif";
      ctx.fillText("原创几何动画 · 无第三方片源", 480, 302);
      if (Math.floor(t) !== last) {
        last = Math.floor(t);
        setSeconds(last);
      }
      frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  return (
    <section className="demo-player-page">
      <Link href={"/series/" + drama.id}>← 返回详情</Link>
      <h1>
        {drama.title} · 第 {n} 集
      </h1>
      <div className="demo-screen">
        <canvas
          width="960"
          height="540"
          ref={canvas}
          aria-label="原创几何动画演示"
          hidden={!playing}
        />
        {!playing && (
          <div
            className="demo-screen-cover"
            style={{
              backgroundImage: `linear-gradient(#0005,#000a),url(${drama.image})`,
            }}
          >
            <strong>前端播放器交互演示</strong>
            <p>播放原创几何动画，不提供影视片源。</p>
          </div>
        )}
        <button
          className="jf-btn jf-btn-primary"
          onClick={() => setPlaying((v) => !v)}
          disabled={!supported}
        >
          {!supported
            ? "浏览器不支持 Canvas"
            : playing
              ? "暂停演示"
              : "播放演示"}
        </button>
        <span className="demo-timer">本次播放 {seconds}s · 无音轨</span>
      </div>
      <p>
        这是 Canvas 动画演示，不是实际视频解码、流媒体或 DRM
        播放服务；分集共用此动画。
      </p>
      <EpisodeDirectory series={drama.id} current={n} />
      <Interactions series={drama.id} />
    </section>
  );
}
