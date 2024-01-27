import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Draft } from "immer";
import type { PayloadAction } from '@reduxjs/toolkit';

import { Coordinate } from 'ol/coordinate';
import { Pixel } from 'ol/pixel';
import MapBrowserEvent from 'ol/MapBrowserEvent';

/**
 * Information about the mouse.
 */
export interface MouseState {
    /**
     * Whether we update the internal state with mouse coordinates
     * on each mouse move.
     */
    tracking: boolean;

    /**
     * The current mouse position.
     */
    mapPos: Coordinate;

    /**
     * The current mouse position in pixels.
     */
    pixelPos: Pixel;
};


const initialState: MouseState = {
    tracking: false,
    mapPos: [-1, -1],
    pixelPos: [-1, -1]
};


/**
 * Current display management.
 */
export const mouseSlice = createSlice({
    name: 'mouse',
    initialState,
    reducers: {
        /**
         * Sets the mouse position.
         */
        setMousePos: (state, action: PayloadAction<MapBrowserEvent<any>>) => {
            if (state.tracking && !action.payload.dragging) {
                state.mapPos = action.payload.coordinate;
                state.pixelPos = action.payload.pixel;
            }
        }
    },
});


export const {
    setMousePos,
} = mouseSlice.actions;
