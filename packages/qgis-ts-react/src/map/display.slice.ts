import { Dispatch, useMemo } from 'react';
import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import "immer";
import type { PayloadAction } from '@reduxjs/toolkit';


/**
 * Information about the display.
 */
export interface DisplayState {

    /**
     * The size of the buttons in the map.
     */
    buttonSize: "small" | "medium" | "large";

    /**
     * Tell if the settings dialog is open.
     */
    settingsOpen: boolean;

    /**
     * Indicate if the display is in full screen mode.
     */
    fullScreen: boolean;
};


const initialState: DisplayState = {
    buttonSize: "medium",
    settingsOpen: false,
    fullScreen: false,
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
        setButtonSize: (state, action: PayloadAction<"small" | "medium" | "large">) => {
            state.buttonSize = action.payload;
        },
        setSettingsOpen: (state, action: PayloadAction<boolean>) => {
            state.settingsOpen = action.payload;
        },
    },
});


export const {
    setFullScreen,
    setButtonSize,
    setSettingsOpen,
} = displaySlice.actions;


/**
 * The result of the `useLayersSlice` hook.
 */
export interface UseDisplaySliceResult {
    /**
     * Change the size of the buttons in the map.
     */
    setButtonSize: (size: "small" | "medium" | "large") => void;

    /**
     * Change the open/closed state of the settings dialog.
     */
    setSettingsOpen: (open: boolean) => void;
};


/**
 * Provides some of the callbacks related to display management.
 *
 * The callbacks that depend on other elements of the map are provided
 * by the QgisMapContext.
 */
export function useDisplaySlice(dispatch: Dispatch<any>): UseDisplaySliceResult {
    return {
        setButtonSize: (size: "small" | "medium" | "large") => {
            dispatch(setButtonSize(size));
        },
        setSettingsOpen: (open: boolean) => {
            dispatch(setSettingsOpen(open));
        },
    };
}
