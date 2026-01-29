"use client";

import { SWRConfig } from "swr";
import { fetcher } from "../lib/fetcher";

const swrConfig = {
    fetcher,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false, // 캐시된 데이터가 있으면 재검증하지 않음
    keepPreviousData: true, // 이전 데이터 유지
};

export function SWRProvider({ children }: { children: React.ReactNode }) {
    return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
