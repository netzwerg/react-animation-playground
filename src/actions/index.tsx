import { Item } from '../types';

export type RootAction = UpdateItemAction;

export type UpdateItemAction = {
    readonly type: 'updateItem';
    readonly item: Item;
};

export const updateItem = (item: Item): UpdateItemAction => {
    return {
        type: 'updateItem',
        item
    };
};