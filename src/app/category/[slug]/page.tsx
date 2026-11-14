import { notFound } from "next/navigation";
import { PageFrame } from "@/components/AppShell";
import { FrontCategory } from "@/components/FrontCategory";
import { demoCategories } from "@/lib/demo-catalog";
export function generateStaticParams() {
  return demoCategories.map((slug) => ({ slug }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  if (!demoCategories.includes(category)) notFound();
  return (
    <PageFrame>
      <FrontCategory category={category} />
    </PageFrame>
  );
}
