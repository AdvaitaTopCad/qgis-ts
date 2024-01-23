import { createContext, useContext } from 'react';
import { QgisMapState } from './store';
import { IntlShape } from 'react-intl';
import { LayerID, MapLayer } from './layers.slice';


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

    /**
     * The translation provider.
     */
    intl: IntlShape;

    /**
     * The current parent layer.
     *
     * This is used to allow creating thr tree of layers using React
     * components via `MapLayerComp`.
     */
    groupLayerInTree: LayerID;

    /**
     * The callback to set the active base layer.
     */
    setActiveBaseLayer: (layerId: LayerID | undefined) => void;

    /**
     * The callback to set the active overlay layer.
     */
    setActiveOverlayLayer: (layerId: LayerID | undefined) => void;

    /**
     * The callback to add a base layer.
     */
    addBaseLayer: (layer: MapLayer, activate?: boolean) => void;

    /**
     * The callback to remove a base layer.
     */
    removeBaseLayer: (layerId: string) => void;

    /**
     * The callback to edit a base layer.
     */
    editBaseLayer: (layer: MapLayer, activate?: boolean) => void;

    /**
     * The callback to add an overlay layer.
     */
    addOverlayLayer: (layer: MapLayer, activate?: boolean) => void;

    /**
     * The callback to remove an overlay layer.
     */
    removeOverlayLayer: (layerId: string) => void;

    /**
     * The callback to edit an overlay layer.
     */
    editOverlayLayer: (layer: MapLayer, activate?: boolean) => void;

    /**
     * The callback to reorder a base layer.
     */
    reorderOverlayLayer: (
        layer: LayerID,
        parent: LayerID | undefined,
        index: number,
    ) => void;
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
