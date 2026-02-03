import React from "react";

interface FloatingTextProps {
    id: number;
    text: string;
    x: number;
    y: number;
}

const FloatingText: React.FC<FloatingTextProps> = ({ id, text, x, y }) => {
    return (
        <div
            key={id}
            className="fixed pointer-events-none text-head-brown font-bold text-2xl animate-float-up z-50 shadow-sm"
            style={{ left: x, top: y }}
        >
            {text}
        </div>
    );
};

export default FloatingText;
