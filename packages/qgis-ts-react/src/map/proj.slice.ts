import Projection from "ol/proj/Projection";
import { Dispatch, useMemo } from 'react';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


/**
 * The unique ID of the projection.
 *
 * This is also used with the translation engine to get the
 * user-visible string for the projection.
 */
export type ProjectionId = string;


/**
 * Information about the proj in a map.
 */
export interface ProjState {
    /**
     * The unique ID of the projection.
     *
     * This is also used with the translation engine to get the
     * user-visible string for the projection.
     */
    projection: ProjectionId;

    /**
     * The list of projections that we know about.
     */
    projections: Record<ProjectionId, Projection>;
};


const initialState: ProjState = {
    projection: "EPSG:4326",
    projections: {}
};


/**
 * Current proj management.
 */
export const projSlice = createSlice({
    name: 'proj',
    initialState,
    reducers: {
        setActiveProj: (
            state, action: PayloadAction<ProjectionId>
        ) => {
            state.projection = action.payload;
        },
    },
});


export const {
    setActiveProj,
} = projSlice.actions;


/**
 * The result of the `useProjSlice` hook.
 */
export interface UseProjSliceResult {

    /**
     * The callback to set the active base proj.
     */
    setActiveProj: (projId: ProjectionId) => void;

}


/**
 * Implementation for callbacks related to the proj.
 */
export const useProjSlice = (dispatch: Dispatch<any>) => (
    useMemo<UseProjSliceResult>(() => ({

        // The callback to set the active base proj.
        setActiveProj: (projId: ProjectionId) => {
            dispatch(setActiveProj(projId));
        },

    }), [])
);
