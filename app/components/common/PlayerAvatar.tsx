interface PlayerAvatarProps {
    name: string;
    size?: "sm" | "md";
}

export default function PlayerAvatar({ name, size = "md" }: PlayerAvatarProps) {
    const initial = name.length >= 2 ? name.slice(0, 2) : name.slice(0, 1);
    const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
    return (
        <div
            className={`${sizeClass} rounded-full bg-head-blue text-head-white flex items-center justify-center font-medium shrink-0`}
        >
            {initial}
        </div>
    );
}
