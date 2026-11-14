"use client";

import { useEffect, useState } from "react";

// 2026-11-07 前台改版：断点跟随参考站实测，767px 及以下使用手机版布局（底部导航、全屏播放）。
export const MOBILE_LAYOUT_QUERY = "(max-width: 767px)";

export function useMobileLayout() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(MOBILE_LAYOUT_QUERY);
    const sync = () => setMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return mobile;
}
