import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Draft } from "immer";
import type { PayloadAction } from '@reduxjs/toolkit';

import type { QgisMapState } from './store';

/**
 * Information about the display.
 */
export interface DisplayState {

    /**
     * Indicate if the display is in full screen mode.
     */
    fullScreen: boolean;
};


const initialState: DisplayState = {
    fullScreen: false
};


/**
 * Current display management.
 */
export const displaySlice = createSlice({
    name: 'display',
    initialState,
    reducers: {
        setFullScreen: (state, action: PayloadAction<boolean>) => {
            state.fullScreen = action.payload;
        },
    },
});


export const {
    setFullScreen
} = displaySlice.actions;
