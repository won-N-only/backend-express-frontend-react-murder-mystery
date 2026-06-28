import type { Combination, MatchGame } from "@app/types";
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
    combinations?: Combination[];
    matches?: MatchGame[];
}

export function useMatch() {
    const [matches, setMatches] = useState<MatchGame[]>([]);
    const [combinations, setCombinations] = useState<Combination[]>([]);
    const [loading, setLoading] = useState(false);

    const executeMatch = async (options: MatchOptions) => {
        if (!options.playerIds.length) return;
        setLoading(true);
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
            const res = await fetch("/api/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
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
