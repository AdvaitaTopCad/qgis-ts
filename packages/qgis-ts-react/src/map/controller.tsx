import { FC, ReactNode, useCallback, useId, useReducer, useRef } from 'react';
import { combineReducers } from 'redux';

import { QgisMapContextProvider } from './context';
import type { QgisMapContext } from './context';
import { reducerObject, initialState } from './store';


/**
 * Properties expected by the QGis map controller.
 */
export interface QgisMapControllerProps {

    /**
     * The children of the controller.
     */
    children: ReactNode;
};


/**
 * Internal data for the QGis map controller.
 */
interface ControllerData {

    /**
     * The HTML element that contains the map.
     */
    mapNode: HTMLDivElement | null;
}


/**
 * The QGis map controller.
 */
export const QgisMapController: FC<QgisMapControllerProps> = ({
    children
}) => {

    // Generate a unique ID for the map.
    const mapId = useId();

    // This is where we keep internal map data not suitable for state.
    const mapData: ControllerData = useRef<ControllerData>({
        mapNode: null,
    }).current;


    // Called after the div element is mounted.
    const mapRef = useCallback((node: HTMLDivElement | null) => {
        if (node === null) {
            return;
        }

        mapData.mapNode = node;
    }, []);


    // The internal state of the map.
    const [state, dispatch] = useReducer(
        combineReducers(reducerObject), initialState
    );

    // Compute the value that will be provided through the context.
    const value: QgisMapContext = {
        mapId,
        mapRef,
        ...state
    };

    return (
        <QgisMapContextProvider value={value}>
            {children}
        </QgisMapContextProvider>
    );
};
