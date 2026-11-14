import { notFound } from "next/navigation";
import { PageFrame } from "@/components/AppShell";
import { DemoPlayer } from "@/components/DemoPlayer";
import { demoDramas } from "@/lib/demo-catalog";
export function generateStaticParams() {
  return demoDramas.flatMap((d) =>
    (d.episodeList || []).map((e) => ({ id: e.id })),
  );
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const drama = demoDramas.find((d) => d.episodeList?.some((e) => e.id === id)),
    episode = drama?.episodeList?.find((e) => e.id === id);
  if (!drama || !episode) notFound();
  return (
    <PageFrame>
      <DemoPlayer drama={drama} n={episode.number} />
    </PageFrame>
  );
}
