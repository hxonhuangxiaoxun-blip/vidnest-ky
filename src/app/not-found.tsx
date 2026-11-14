import Link from "next/link";
export default function NotFound() {
  return (
    <main className="demo-content">
      <h1>页面不存在</h1>
      <Link href="/">返回演示首页</Link>
    </main>
  );
}
