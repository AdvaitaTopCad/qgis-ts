import { Options as MouseWheelZoomOptions } from 'ol/interaction/MouseWheelZoom';
import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Draft } from "immer";
import type { PayloadAction } from '@reduxjs/toolkit';

import type { QgisMapState } from './store';

/**
 * Information about the display.
 */
export interface MouseState extends Omit<MouseWheelZoomOptions, "condition">{
};


const initialState: MouseState = {
    onFocusOnly: false,
    maxDelta: 1,
    duration: 250,
    timeout: 80,
    useAnchor: true,
    constrainResolution: false,
};


/**
 * Current display management.
 */
export const mouseSlice = createSlice({
    name: 'mouse',
    initialState,
    reducers: {
        setFocusOnly: (state, action: PayloadAction<boolean>) => {
            state.onFocusOnly = action.payload;
        },
        setMaxDelta: (state, action: PayloadAction<number>) => {
            state.maxDelta = action.payload;
        },
        setDuration: (state, action: PayloadAction<number>) => {
            state.duration = action.payload;
        },
        setTimeout: (state, action: PayloadAction<number>) => {
            state.timeout = action.payload;
        },
        setUseAnchor: (state, action: PayloadAction<boolean>) => {
            state.useAnchor = action.payload;
        },
        setConstrainResolution: (state, action: PayloadAction<boolean>) => {
            state.constrainResolution = action.payload;
        },
    },
});


