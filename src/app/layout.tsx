import type { Metadata } from "next";
import "./globals.css";
import "./front.css";
import "./demo.css";
import { ViewerProvider } from "@/components/ViewerProvider";
import { CatalogProvider } from "@/components/CatalogProvider";
export const metadata: Metadata = {
  title: "VidNest · 前端学习演示",
  description: "纯前端视频界面演示，虚构数据，MIT 许可，支持学习与二次开发。",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" data-surface="front">
      <body>
        <ViewerProvider>
          <CatalogProvider>{children}</CatalogProvider>
        </ViewerProvider>
      </body>
    </html>
  );
}
