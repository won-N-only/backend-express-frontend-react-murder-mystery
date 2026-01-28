import { useState } from "react";

interface MatchOptions {
    playerIds: string[];
    playerCount?: number;
    useCombination: boolean;
    excludePartySeries: boolean;
    excludeSinglePlayer: boolean;
}

interface MatchResult {
    type: "combination" | "single";
    combinations?: any[];
    matches?: any[];
}

export function useMatch() {
    const [matches, setMatches] = useState<any[]>([]);
    const [combinations, setCombinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const executeMatch = async (options: MatchOptions) => {
        if (!options.playerIds.length) return;
        setLoading(true);
        try {
            const res = await fetch("/api/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    playerIds: options.playerIds,
                    playerCount: options.useCombination ? undefined : options.playerCount,
                    useCombination: options.useCombination,
                    excludePartySeries: options.excludePartySeries,
                    excludeSinglePlayer: options.excludeSinglePlayer,
                }),
            });
            const json: MatchResult = await res.json();
            if (json.type === "combination") {
                setCombinations(json.combinations ?? []);
                setMatches([]);
            } else {
                setMatches(json.matches ?? []);
                setCombinations([]);
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        matches,
        combinations,
        loading,
        executeMatch,
    };
}
