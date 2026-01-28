"use client";

import useSWR from "swr";
import StatsSection from "../components/StatsSection";
import { fetcher } from "../lib/fetcher";
import type { CompanyStat, PlayerStat } from "../types";

export default function StatsPage() {
    const { data } = useSWR("/api/stats", fetcher);
    const stats = data?.stats ?? {};
    const players: PlayerStat[] = stats.players ?? [];
    const companies: CompanyStat[] = stats.companies ?? [];

    return <StatsSection players={players} companies={companies} />;
}
