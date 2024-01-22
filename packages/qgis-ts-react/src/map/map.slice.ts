import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Draft } from "immer";
import type { PayloadAction } from '@reduxjs/toolkit';

import type { QgisMapState } from './store';

/**
 * Information about the display.
 */
export interface MapState {


};


const initialState: MapState = {

};


/**
 * Current display management.
 */
export const displaySlice = createSlice({
    name: 'map',
    initialState,
    reducers: {

    },
});


// export const {
//     toggleFullScreen
// } = displaySlice.actions;


/**
 * Tells if the application is in full screen mode.
 */
// export const selectFullScreen = (state: QgisMapState) => state.display.fullScreen;
