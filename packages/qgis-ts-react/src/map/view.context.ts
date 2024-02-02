import { createContext, useContext } from "react";

/**
 * The openlayers map instance.
 */
export interface QgisMapViewContext {

    /**
     * The id of the div element that contains the map.
     */
    mapId: string;

    /**
     * The callback that should be provided to the div's ref property
     */
    mapRef: (element: HTMLDivElement | null) => void;
};


// The context object.
const theContext = createContext<QgisMapViewContext | null>(null);

/**
 * The provider used to wrap react component to allow them access to
 * map data.
 */
export const QgisMapViewContextProvider = theContext.Provider;


/**
 * The hook to use for retrieving the underlying OpenLayers map from context.
 */
export const useQgisMapViewContext = () => {
    const context = useContext(theContext);
    if (context === null) {
        throw new Error('QgisMapViewContextProvider not found');
    }

    return context;
}
