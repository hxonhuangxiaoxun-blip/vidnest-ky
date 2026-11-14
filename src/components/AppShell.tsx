"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Home, Trophy, Bookmark } from "lucide-react";
import { useViewer } from "./ViewerProvider";
const links = [
  { href: "/", label: "首页", icon: Home },
  { href: "/ranking", label: "排行榜", icon: Trophy },
  { href: "/search", label: "搜索", icon: Search },
  { href: "/account", label: "收藏", icon: Bookmark },
];
export function PageFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(),
    { language, setLanguage } = useViewer();
  return (
    <div className="jf jf-shell jf-app">
      <header className="demo-header">
        <Link className="demo-brand" href="/">
          ▶ <strong>VidNest</strong>
          <span>FRONTEND DEMO</span>
        </Link>
        <nav aria-label="主导航">
          {links.map((l) => (
            <Link
              key={l.href}
              className={pathname === l.href ? "active" : ""}
              href={l.href}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          className="jf-btn jf-btn-ghost jf-btn-sm"
          onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
        >
          {language === "zh" ? "EN" : "中文"}
        </button>
        <a
          className="demo-source"
          href="https://github.com/hxonhuangxiaoxun-blip/vidnest-ky"
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
      </header>
      <aside className="demo-banner">
        学习与二次开发演示 · 虚构内容 / 原创几何素材 ·
        无真实账号、支付或后台服务 <Link href="/about">使用声明</Link>
      </aside>
      <main>{children}</main>
      <footer className="demo-footer">
        <strong>VidNest · Frontend</strong>
        <p>
          MIT 许可，欢迎学习、修改与二次开发。功能思路参考
          PeerTube，未使用其源码，与其无官方关联。
        </p>
        <Link href="/about">许可与合规声明</Link>
        <span> © 2026 hxonhuangxiaoxun-blip</span>
      </footer>
      <nav className="jf-tabbar" aria-label="移动导航">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              className={pathname === l.href ? "active" : ""}
              href={l.href}
            >
              <Icon size={21} />
              <span>{l.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
