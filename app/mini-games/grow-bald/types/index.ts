export type LevelData = {
    item_name: string;
    item_desc: string;
    cost: number;
    price: number;
    click_gold: number;
    success_msg: string;
    maintain_msg?: string;
    fail_msg?: string;
    success_rate: number;
    maintain_rate: number;
    fail_rate: number;
};

export type FloatingText = {
    id: number;
    text: string;
    x: number;
    y: number;
};