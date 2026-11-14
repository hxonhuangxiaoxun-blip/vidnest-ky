import { notFound } from "next/navigation";
import { PageFrame } from "@/components/AppShell";
import { FrontSeries } from "@/components/FrontSeries";
import { demoDramas } from "@/lib/demo-catalog";
export function generateStaticParams() {
  return demoDramas.map((d) => ({ id: d.id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const drama = demoDramas.find((d) => d.id === id);
  if (!drama) notFound();
  return (
    <PageFrame>
      <FrontSeries drama={drama} firstEpisode={drama.firstEpisode || null} />
    </PageFrame>
  );
}
