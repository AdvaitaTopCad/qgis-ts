import { configureStore } from '@reduxjs/toolkit'

import { displaySlice } from './display.slice';

export const reducerObject = {
    [displaySlice.name]: displaySlice.reducer,
};

export const initialState = {
    [displaySlice.name]: displaySlice.getInitialState(),
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
