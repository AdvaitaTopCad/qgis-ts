import { FC, PropsWithChildren, useCallback } from "react";
import {
    QgisMapContext, QgisMapContextProvider, QgisMapLayersContextProvider,
    QgisMapMouseContextProvider, QgisMapViewContextProvider, QgisOlMapContextProvider, ROOT_LAYER_ID
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
    const layerCallbacks = {

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
    }
    return (
        <QgisMapContextProvider value={{
            intl: useIntl(),
            ...layerCallbacks,

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

            display: {
                fullScreen: false,
            },

            ...props
        }}>
            <QgisMapLayersContextProvider value={{
                bases: {},
                activeBase: undefined,
                overlays: {},
                activeOverlay: undefined,
                layerTree: {},

                // The current parent layer used to construct the tree.
                groupLayerInTree: ROOT_LAYER_ID,

                ...layerCallbacks
            }}>
                <QgisMapMouseContextProvider value={{
                    mapPos: [0, 0],
                    pixelPos: [0, 0],
                    tracking: true,
                }}>
                    <QgisOlMapContextProvider value={new OlMap({
                        layers: [],
                        controls: [],
                        interactions: [],
                        // keyboardEventTarget: data.mapNode as HTMLElement,
                        view: new OlView({
                            center: [0, 0],
                            zoom: 0,
                        })
                    })}>
                        <QgisMapViewContextProvider value={{
                            mapId: "mapId",
                            mapRef: useCallback(
                                (element: HTMLDivElement | null) => {
                                    console.log("mapRef(element=%O)", element);
                                }, []
                            ),
                        }}>
                            {children}
                        </QgisMapViewContextProvider>
                    </QgisOlMapContextProvider>
                </QgisMapMouseContextProvider>
            </QgisMapLayersContextProvider>
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
