import { createContext, useContext } from 'react';
import { QgisMapState } from './store';

/**
 * The data that is stored in context for each map.
 */
export interface QgisMapContext extends QgisMapState {

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
    return useContext<QgisMapContext>(qgisMapContext as any) as QgisMapContext;
};
