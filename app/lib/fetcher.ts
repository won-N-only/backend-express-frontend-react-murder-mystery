import { ApiError } from "./ApiError";

export const fetcher = async (url: string) => {
    const r = await fetch(url);
    if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new ApiError(r.status, body.error ?? `HTTP ${r.status}`);
    }
    return r.json();
};
