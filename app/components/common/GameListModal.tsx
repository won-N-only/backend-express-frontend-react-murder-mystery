"use client";

import React, { useEffect } from "react";

interface SearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onSearch?: () => void;
}

interface GameListModalProps {
    title: string;
    subtitle?: string;
    onClose: () => void;
    searchProps?: SearchProps;
    children: React.ReactNode;
    isLoading?: boolean;
    isEmpty?: boolean;
    emptyMessage?: string;
}

export default function GameListModal({
    title,
    subtitle,
    onClose,
    searchProps,
    children,
    isLoading,
    isEmpty,
    emptyMessage = "데이터가 없습니다.",
}: GameListModalProps) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-head-main shadow-lg max-w-content w-full max-h-[90vh] overflow-hidden flex flex-col p-[30px]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className="bg-head-main py-4 flex-shrink-0">
                    <div>
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-head-text">
                                    {title}
                                </h2>
                                {subtitle && (
                                    <p className="text-sm font-semibold text-head-text mt-[10px]">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="text-head-text text-2xl leading-none font-normal hover:opacity-80 btn-standard-padding"
                                aria-label="닫기"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                    {searchProps && (
                        <div className="flex h-[50px] mt-[20px]">
                            <input
                                type="text"
                                placeholder={searchProps.placeholder || "검색"}
                                value={searchProps.value}
                                onChange={(e) => searchProps.onChange(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        searchProps.onSearch?.();
                                    }
                                }}
                                className="flex-1 border border-head-border bg-head-white px-4 py-2 text-head-text focus:outline-none focus:ring-2 focus:ring-head-brown focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={searchProps.onSearch}
                                className="bg-head-brown text-lg text-white font-extrabold hover:opacity-90 transition-opacity btn-standard-padding"
                            >
                                검색
                            </button>
                        </div>
                    )}
                </div>

                {/* 리스트 영역 */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {isLoading ? (
                        <div className="text-center py-8 text-head-text">로딩 중...</div>
                    ) : isEmpty ? (
                        <div className="text-center py-8 text-head-text">
                            {emptyMessage}
                        </div>
                    ) : (
                        <div className="mt-[20px]">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}