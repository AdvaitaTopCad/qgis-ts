import { FC, PropsWithChildren, useCallback } from "react";
import {
    QgisMapContext, QgisMapContextProvider, ROOT_LAYER_ID
} from "@qgis-ts/react";
import OlMap from 'ol/Map'
import OlView from 'ol/View';
import type {
    LayerID, MapLayer,
} from "@qgis-ts/react";
import { IntlProvider, useIntl } from "react-intl";


/**
 * The properties of the debug controller.
 */
export type MapDebugControllerProps =
    PropsWithChildren<Partial<QgisMapContext>>;


/**
 * A controller that provides default for properties not set by the caller.
 *
 * This is useful if you want to focus on certain context values while letting
 * the controller provide the rest.
 */
export const MapDebugControllerInner: FC<MapDebugControllerProps> = ({
    children,
    ...props
}) => {
    return (
        <QgisMapContextProvider value={{
            olMap: new OlMap({
                layers: [],
                controls: [],
                interactions: [],
                // keyboardEventTarget: data.mapNode as HTMLElement,
                view: new OlView({
                    center: [0, 0],
                    zoom: 0,
                })
            }),

            mapId: "mapId",

            mapRef: useCallback((element: HTMLDivElement | null) => {
                console.log("mapRef(element=%O)", element);
            }, []),

            intl: useIntl(),

            // The current parent layer used to construct the tree.
            groupLayerInTree: ROOT_LAYER_ID,

            // The callback to set the active base layer.
            setActiveBaseLayer: useCallback((layerId: LayerID | undefined) => {
                console.log("setActiveBaseLayer(layerId=%O)", layerId);
            }, []),

            // The callback to set the active overlay layer.
            setActiveOverlayLayer: useCallback((layerId: LayerID | undefined) => {
                console.log("setActiveOverlayLayer(layerId=%O)", layerId);
            }, []),

            // The callback to add a base layer.
            addBaseLayer: useCallback((layer: MapLayer, activate?: boolean) => {
                console.log(
                    "addBaseLayer({ layer: %O, activate: %O })",
                    layer, activate
                );
            }, []),

            // The callback to remove a base layer.
            removeBaseLayer: useCallback((layerId: string) => {
                console.log("removeBaseLayer(layerId=%O)", layerId);
            }, []),

            // The callback to edit a base layer.
            editBaseLayer: useCallback((layer: MapLayer, activate?: boolean) => {
                console.log(
                    "editBaseLayer({ layer: %O, activate: %O })",
                    layer, activate
                );
            }, []),

            // The callback to add an overlay layer.
            addOverlayLayer: useCallback((layer: MapLayer, activate?: boolean) => {
                console.log(
                    "addOverlayLayer({ layer: %O, activate: %O })",
                    layer, activate
                );
            }, []),

            // The callback to remove an overlay layer.
            removeOverlayLayer: useCallback((layerId: string) => {
                console.log("removeOverlayLayer(layerId=%O)", layerId);
            }, []),

            // The callback to edit an overlay layer.
            editOverlayLayer: useCallback((layer: MapLayer, activate?: boolean) => {
                console.log(
                    "editOverlayLayer({ layer: %O, activate: %O })",
                    layer, activate
                );
            }, []),

            // The callback to reorder a base layer.
            reorderOverlayLayer: useCallback((
                layer: LayerID,
                parent: LayerID | undefined,
                index: number,
            ) => {
                console.log(
                    "reorderOverlayLayer({ layer: %O, parent: %O, index: %O })",
                    layer, parent, index
                );
            }, []),

            // Callback for entering-exiting the full screen mode.
            setFullScreen: useCallback((value: boolean) => {
                console.log("setFullScreen(value=%O)", value);
            }, []),

            // ------------------ [ State ] ------------------

            map: {
                view: {
                    center: [0, 0],
                    zoom: 0,
                    bbox: {
                        bounds: [0, 0, 0, 0],
                        rotation: 0,
                    },
                    size: {
                        width: 0,
                        height: 0,
                    }
                },
                homeView: {
                    center: [0, 0],
                    zoom: 0,
                },
            },

            layers: {
                bases: {},
                activeBase: undefined,
                overlays: {},
                activeOverlay: undefined,
                layerTree: {},
            },

            mouse: {
                onFocusOnly: false,
                maxDelta: 1,
                duration: 250,
                timeout: 80,
                useAnchor: true,
                constrainResolution: false,
            },

            display: {
                fullScreen: false,
            },

            ...props
        }}>
            {children}
        </QgisMapContextProvider>
    )
}


/**
 * A controller that provides default for properties not set by the caller.
 *
 * This is useful if you want to focus on certain context values while letting
 * the controller provide the rest.
 */
export const MapDebugController: FC<MapDebugControllerProps> = (props) => {
    return (
        <IntlProvider locale="en" onError={() => { }}>
            <MapDebugControllerInner {...props} />
        </IntlProvider>
    );
}
