import React from "react";
import { LevelData } from "../types";

interface ItemInfoProps {
    level: number;
    currentLevel: LevelData;
}

const ItemInfo: React.FC<ItemInfoProps> = ({ level, currentLevel }) => {
    return (
        <div className="w-full gap-4 flex flex-col">
            <div className=" p-4 md:p-6 rounded-2xl bg-white/80 gap-4 flex flex-col">
                <div className="font-bold text-xl md:text-3xl text-head-text">
                    +{level} {currentLevel.item_name}
                </div>
                <div className="font-medium text-sm md:text-lg text-head-gray-500">
                    {currentLevel.item_desc}
                </div>
            </div>
        </div>
    );
};

export default ItemInfo;
