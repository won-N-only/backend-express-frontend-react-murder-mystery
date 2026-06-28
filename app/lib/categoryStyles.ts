export type CategoryKey = "오프라인" | "크라임씬" | "온라인/미정발" | "우즈/리얼월드";

export const CATEGORY_STYLES: Record<CategoryKey, { border: string; badge: string }> = {
    "오프라인":     { border: "border-amber-400",   badge: "bg-amber-50 text-amber-800" },
    "크라임씬":     { border: "border-rose-500",     badge: "bg-rose-50 text-rose-800" },
    "온라인/미정발": { border: "border-emerald-500",  badge: "bg-emerald-50 text-emerald-800" },
    "우즈/리얼월드": { border: "border-violet-400",   badge: "bg-violet-50 text-violet-800" },
};

const FALLBACK = { border: "border-transparent", badge: "bg-head-white/70 text-head-text" };

export function getCategoryStyle(category: string | null | undefined) {
    if (category && category in CATEGORY_STYLES) {
        return CATEGORY_STYLES[category as CategoryKey];
    }
    return FALLBACK;
}
