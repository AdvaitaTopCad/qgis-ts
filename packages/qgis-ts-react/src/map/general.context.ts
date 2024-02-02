import OlMap from 'ol/Map';
import { createContext, useContext } from 'react';
import { IntlShape } from 'react-intl';

import { QgisMapState } from './store';
import { LayerID } from '../layers';
import { UseLayersSliceResult } from './layers.slice';


/**
 * The data that is stored in context for each map.
 */
export interface QgisMapContext extends
    Omit<QgisMapState, "mouse" | "layers" | "display">,
    UseLayersSliceResult {

    /**
     * The translation provider.
     */
    intl: IntlShape;
};


// Context of the QGis map component.
const theContext = createContext<QgisMapContext | null>(null);


/**
 * The provider used to wrap react component to allow them access to
 * map data.
 */
export const QgisMapContextProvider = theContext.Provider;


/**
 * The hook to use for retrieving the data from context about the QGis map.
 */
export const useQgisMapContext = () => {
    const context = useContext<QgisMapContext>(
        theContext as any
    ) as QgisMapContext;
    if (context === null) {
        throw new Error(
            'useQgisMapContext must be used within a QgisMapContextProvider'
        );
    }
    return context;
};
