export type RootState = {
    readonly item: Item;
};

export type Item = {
    readonly id: string;
    readonly step: number;
};