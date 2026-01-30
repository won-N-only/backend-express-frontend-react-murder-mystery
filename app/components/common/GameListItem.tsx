"use client";

import React from "react";

interface GameListItemProps {
    orderNumber: number;
    title: string;
    subtitle?: React.ReactNode;
    action?: React.ReactNode;
    onClick?: () => void;
}

export default function GameListItem({
    orderNumber,
    title,
    subtitle,
    action,
    onClick,
}: GameListItemProps) {
    const Container = onClick ? "button" : "div";

    return (
        <Container
            className={`w-full text-left h-[108px] pl-[20px] flex items-center justify-between py-3 bg-head-white mb-[10px] ${
                onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
            }`}
            onClick={onClick}
            type={onClick ? "button" : undefined}
        >
            <div className="min-w-0 p-2 flex-1">
                <div className="text-xs text-head-gray-500 font-medium">
                    #{orderNumber}
                </div>
                <div className="text-base font-bold text-head-text truncate">
                    {title}
                </div>
                {subtitle && (
                    <div className="text-xs font-medium text-head-text mt-1">
                        {subtitle}
                    </div>
                )}
            </div>

            {action && (
                <div className="mr-[20px] flex-shrink-0">
                    {action}
                </div>
            )}
        </Container>
    );
}