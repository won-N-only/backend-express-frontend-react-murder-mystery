"use client";

import type { Player } from "@app/types";
import { useEffect, useRef, useState } from "react";

interface AuthorSuggestInputProps {
    players: Player[];
    value: string;
    selectedId: string | null;
    onChange: (playerId: string | null, playerName: string) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
}

export default function AuthorSuggestInput({
    players,
    value,
    selectedId,
    onChange,
    disabled = false,
    placeholder = "이름 입력 후 아래에서 선택",
    className = "",
    inputClassName = "",
}: AuthorSuggestInputProps) {
    const [query, setQuery] = useState(value);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const suggestions = query.trim()
        ? players.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        : players;

    const handleSelect = (p: Player) => {
        onChange(p._id, p.name);
        setQuery(p.name);
        setOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setQuery(v);
        onChange(null, v);
        setOpen(true);
    };

    const handleFocus = () => setOpen(true);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={handleFocus}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full text-sm border border-head-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-head-brown focus:border-transparent ${inputClassName}`}
                autoComplete="off"
            />
            {open && suggestions.length > 0 && (
                <ul
                    className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-head-border bg-white shadow-lg py-1"
                    role="listbox"
                >
                    {suggestions.map((p) => (
                        <li
                            key={p._id}
                            role="option"
                            aria-selected={selectedId === p._id}
                            onClick={() => handleSelect(p)}
                            className="px-3 py-2 text-sm text-head-text cursor-pointer hover:bg-head-gray-100 focus:bg-head-gray-100"
                        >
                            {p.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
