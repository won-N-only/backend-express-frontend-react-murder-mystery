"use client";

import StatsSection from "@app/components/pages/stats/StatsSection";
import { fetcher } from "@app/lib/fetcher";
import type { CompanyStat, PlayerStat } from "@app/types";
import useSWR from "swr";

export default function StatsPage() {
    const { data, isLoading } = useSWR("/api/stats", fetcher);
    const stats = data?.stats ?? {};
    const players: PlayerStat[] = stats.players ?? [];
    const companies: CompanyStat[] = stats.companies ?? [];

    return <StatsSection players={players} companies={companies} isLoading={isLoading} />;
}
