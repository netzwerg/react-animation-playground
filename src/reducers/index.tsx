import { RootState } from '../types';
import { RootAction } from '../actions';

export const reducer = (state: RootState, action: RootAction): RootState => {
    switch (action.type) {

        case 'updateItem':
            return {
                ...state,
                item: action.item
            };

        default:
            return state;

    }
};