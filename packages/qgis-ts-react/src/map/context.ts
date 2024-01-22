import { createContext, useContext } from 'react';
import { QgisMapState } from './store';


/**
 * The data that is stored in context for each map.
 */
export interface QgisMapContext extends QgisMapState {
    /**
     * The id of the div element that contains the map.
     */
    mapId: string;

    /**
     * The callback that should be provided to the div's ref property
     */
    mapRef: (element: HTMLDivElement | null) => void;


};


/**
 * Context of the QGis map component.
 */
export const qgisMapContext = createContext<QgisMapContext | null>(null);


/**
 * The provider used to wrap react component to allow them access to
 * map data.
 */
export const QgisMapContextProvider = qgisMapContext.Provider;


/**
 * The hook to use for retrieving the data from context about the QGis map.
 */
export const useQgisMapContext = () => {
    const context = useContext<QgisMapContext>(
        qgisMapContext as any
    ) as QgisMapContext
    if (context === null) {
        throw new Error(
            'useQgisMapContext must be used within a QgisMapContextProvider'
        );
    }
    return context;
};
