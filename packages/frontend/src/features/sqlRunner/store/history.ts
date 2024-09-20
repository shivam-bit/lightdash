import { type PayloadAction } from '@reduxjs/toolkit';

export interface HistoryItem<T> {
    value: T;
    timestamp: number;
}

export interface WithHistory<T> {
    current: T;
    past: HistoryItem<NonNullable<T>>[];
}

const DEFAULT_MAX_HISTORY_ITEMS = 10;
const DEFAULT_COMPARE_FUNC = <T>(a: T, b: T) => a !== b;

export const createHistoryReducer = <T>({
    maxHistoryItems = DEFAULT_MAX_HISTORY_ITEMS,
    compareFunc = DEFAULT_COMPARE_FUNC<T>,
}: {
    maxHistoryItems?: number;
    compareFunc?: (a: T, b: T) => boolean;
}) => {
    return {
        addToHistory: (state: WithHistory<T>, action: PayloadAction<T>) => {
            const newItem: HistoryItem<NonNullable<T>> = {
                value: action.payload as NonNullable<T>,
                timestamp: Date.now(),
            };

            // Remove any existing duplicate using the provided comparison function
            state.past = state.past.filter((item) =>
                compareFunc(item.value, newItem.value),
            );

            // Add the new item to the beginning of the past array
            state.past = [newItem, ...state.past].slice(0, maxHistoryItems);
            state.current = action.payload;
        },
    };
};

export const withHistory = <T>(initialValue: T): WithHistory<T> => ({
    current: initialValue,
    past: [],
});
