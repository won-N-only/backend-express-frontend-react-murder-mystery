import { useState } from "react";

interface MatchOptions {
    playerIds: string[];
    playerCount?: number;
    useCombination: boolean;
    excludePartySeries: boolean;
    excludeSinglePlayer: boolean;
    excludeTwoPlayer: boolean;
    numGroups?: number;
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
        const maxRetries = 10;
        const payload = {
            playerIds: options.playerIds,
            playerCount: options.useCombination ? undefined : options.playerCount,
            useCombination: options.useCombination,
            excludePartySeries: options.excludePartySeries,
            excludeSinglePlayer: options.excludeSinglePlayer,
            excludeTwoPlayer: options.excludeTwoPlayer,
            numGroups: options.useCombination ? options.numGroups : undefined,
        };
        try {
            for (let attempt = 0; attempt < maxRetries; attempt++) {
                const res = await fetch("/api/match", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const json: MatchResult = await res.json();
                if (json.type === "combination") {
                    const list = json.combinations ?? [];
                    if (list.length > 0) {
                        setCombinations(list);
                        setMatches([]);
                        return;
                    }
                } else {
                    const list = json.matches ?? [];
                    if (list.length > 0) {
                        setMatches(list);
                        setCombinations([]);
                        return;
                    }
                }
                await new Promise((r) => setTimeout(r, 100));
            }
            setCombinations([]);
            setMatches([]);
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
