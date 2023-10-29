import { createSlice } from '@reduxjs/toolkit';
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
        toggleFullScreen: (state, action: PayloadAction<boolean>) => {
            state.fullScreen = action.payload;
        },
    },
});


export const {
    toggleFullScreen
} = displaySlice.actions;


/**
 * Tells if the application is in full screen mode.
 */
export const selectFullScreen = (state: QgisMapState) => state.display.fullScreen;
