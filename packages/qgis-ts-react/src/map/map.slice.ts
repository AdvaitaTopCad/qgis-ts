import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Draft } from "immer";
import type { PayloadAction } from '@reduxjs/toolkit';

import type { QgisMapState } from './store';
import { Extent } from 'ol/extent';
import { Size } from 'ol/size';
import { Coordinate } from 'ol/coordinate';


/**
 * Information about the map.
 */
export interface ViewState {
    /**
     * The center of the map.
     */
    center: Coordinate;

    /**
     * The zoom level of the map.
     */
    zoom: number | undefined;

    /**
     * The bounding box of the map.
     */
    bbox: {
        bounds: Extent;
        rotation: number;
    }

    /**
     * The size of the map as reported by the view.
     */
    size: {
        width: number;
        height: number;
    },
};


/**
 * Information about the mP.
 */
export interface MapState {
    view: ViewState;

};


const initialState: MapState = {
    view: {
        center: [0, 0],
        zoom: 0,
        bbox: {
            bounds: [0, 0, 0, 0],
            rotation: 0,
        },
        size: {
            width: 0,
            height: 0,
        },
    },
};


/**
 * Current map management.
 */
export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setMapView: (state, action: PayloadAction<ViewState>) => {
            state.view = action.payload;
        },
    },
});


export const {
    setMapView
} = mapSlice.actions;


/**
 * Tells if the application is in full screen mode.
 */
// export const selectFullScreen = (state: QgisMapState) => state.display.fullScreen;
