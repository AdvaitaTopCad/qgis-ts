import { configureStore } from '@reduxjs/toolkit'

import { displaySlice } from './display.slice';
import { mouseSlice } from './mouse.slice';
import { mapSlice } from './map.slice';
import { layersSlice } from './layers.slice';
import { projSlice } from './proj.slice';

export const reducerObject = {
    [displaySlice.name]: displaySlice.reducer,
    [mouseSlice.name]: mouseSlice.reducer,
    [mapSlice.name]: mapSlice.reducer,
    [layersSlice.name]: layersSlice.reducer,
    [projSlice.name]: projSlice.reducer,
};

export const initialState = {
    [displaySlice.name]: displaySlice.getInitialState(),
    [mouseSlice.name]: mouseSlice.getInitialState(),
    [mapSlice.name]: mapSlice.getInitialState(),
    [layersSlice.name]: layersSlice.getInitialState(),
    [projSlice.name]: projSlice.getInitialState(),
};

export const store = configureStore({
    reducer: reducerObject,
})


/**
 * The full state of the QGis map.
 */
export type QgisMapState = ReturnType<typeof store.getState>;


/**
 * The type of the dispatch function for the QGis map.
 */
export type QgisMapDispatch = typeof store.dispatch;
