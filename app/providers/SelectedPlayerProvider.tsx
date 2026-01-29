"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface SelectedPlayerContextValue {
    selectedPlayerId: string | null;
    setSelectedPlayerId: (id: string | null) => void;
}

const SelectedPlayerContext = createContext<SelectedPlayerContextValue | null>(null);

export function SelectedPlayerProvider({ children }: { children: React.ReactNode }) {
    const [selectedPlayerId, setSelectedPlayerIdState] = useState<string | null>(null);
    const setSelectedPlayerId = useCallback((id: string | null) => {
        setSelectedPlayerIdState(id);
    }, []);

    return (
        <SelectedPlayerContext.Provider value={{ selectedPlayerId, setSelectedPlayerId }}>
            {children}
        </SelectedPlayerContext.Provider>
    );
}

export function useSelectedPlayer() {
    const ctx = useContext(SelectedPlayerContext);
    if (!ctx) {
        throw new Error("useSelectedPlayer must be used within SelectedPlayerProvider");
    }
    return ctx;
}
