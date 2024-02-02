import { createContext, useContext } from "react";
import OlMap from 'ol/Map'


/**
 * The openlayers map instance.
 */
export type QgisOlMapContext = OlMap;

// The context object.
const theContext = createContext<QgisOlMapContext | null | undefined>(undefined);

/**
 * The provider used to wrap react component to allow them access to
 * map data.
 */
export const QgisOlMapContextProvider = theContext.Provider;


/**
 * The hook to use for retrieving the underlying OpenLayers map from context.
 */
export const useQgisOlMapContext = () => {
    const context = useContext(theContext);
    if (context === undefined) {
        throw new Error('QgisOlMapContextProvider not found');
    }

    return context;
}
