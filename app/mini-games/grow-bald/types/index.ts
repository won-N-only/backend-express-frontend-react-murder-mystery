export type LevelData = {
    item_name: string;
    item_desc: string;
    cost: number;
    price: number;
    success_msg: string;
    maintain_msg?: string;
    fail_msg?: string;
    /** 0~1, e.g., 0.5 for 50% probability of success */
    success_rate: number;
    maintain_rate: number;
    fail_rate: number;
};
