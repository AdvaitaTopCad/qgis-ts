import { createContext, useContext } from "react";

import { LayersState, UseLayersSliceResult } from "./layers.slice";
import { LayerID } from "../layers";


/**
 * The data about the layers that is stored in context for each map.
 */
export interface QgisMapLayersContext
    extends LayersState, UseLayersSliceResult {

    /**
     * The current parent layer.
     *
     * This is used to allow creating thr tree of layers using React
     * components via `MapLayerComp`.
     */
    groupLayerInTree: LayerID;
};

// The context object.
const theContext = createContext<
    QgisMapLayersContext | null
>(null);

/**
 * The provider used to wrap react component to allow them access to
 * map data.
 */
export const QgisMapLayersContextProvider = theContext.Provider;


/**
 * The hook to use for retrieving the underlying OpenLayers map from context.
 */
export const useQgisMapLayersContext = () => {
    const context = useContext(theContext);
    if (context === null) {
        throw new Error('QgisMapLayersContextProvider not found');
    }

    return context;
}
