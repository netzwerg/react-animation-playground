export type RootState = {
    readonly item: Item;
};

export type ItemId = string;

export type Item = {
    readonly id: ItemId;
    readonly step: number;
};