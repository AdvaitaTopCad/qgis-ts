import {
    FC, ReactNode, useCallback, useEffect, useId, useReducer, useRef
} from 'react';
import {
    useEffectDebugger, useCallbackDebugger, useLogChanges
} from 'use-debugger-hooks';
import { combineReducers } from 'redux';
import { IntlShape, useIntl } from 'react-intl';
import fscreen from 'fscreen';

import OlMap from 'ol/Map';
import OlView, { ViewOptions } from 'ol/View';
import { Coordinate } from 'ol/coordinate';
import XYZ from 'ol/source/XYZ';
import { defaults as olCreateInteractionDefaults } from 'ol/interaction';
import OlInteractionDoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import OlInteractionDragPan from 'ol/interaction/DragPan';
import OlInteractionDraw from 'ol/interaction/Draw';
// import OlInteractionDrawRegular from 'ol-ext/interaction/DrawRegular';
import OlInteractionDragBox from 'ol/interaction/DragBox';
import { createBox as olCreateBox } from 'ol/interaction/Draw';
import OlInteractionKeyboardPan from 'ol/interaction/KeyboardPan';
import OlInteractionKeyboardZoom from 'ol/interaction/KeyboardZoom';
import OlInteractionInteraction from 'ol/interaction/Interaction';
import OlInteractionPointer from 'ol/interaction/Pointer';
import OlInteractionModify from 'ol/interaction/Modify';
import OlInteractionMouseWheelZoom, {
    Options
} from 'ol/interaction/MouseWheelZoom';
import OlInteractionSelect from 'ol/interaction/Select';
import OlInteractionSnap from 'ol/interaction/Snap';
// import OlInteractionTransform from 'ol-ext/interaction/Transform';
import OlInteractionTranslate from 'ol/interaction/Translate';

import { defaults as olCreateControlDefaults } from 'ol/control';
import OlControlOverviewMap from 'ol/control/OverviewMap';
import OlControlScaleLine from 'ol/control/ScaleLine';
import OlControlZoom from 'ol/control/Zoom';

import { LayerID, MapLayer, ROOT_LAYER_ID } from '../layers/defs';
import { QgisMapContextProvider } from './context';
import type { QgisMapContext } from './context';
import { reducerObject, initialState, QgisMapState } from './store';
import { setMapView } from './map.slice';
import { setFullScreen } from './display.slice';
import {
    addBaseLayer, addOverlayLayer, editBaseLayer,
    editOverlayLayer, removeBaseLayer, removeOverlayLayer, reorderOverlayLayer,
    setActiveBaseLayer, setActiveOverlayLayer
} from './layers.slice';
import TileLayer from 'ol/layer/Tile';
import { GenreRegistry } from '../layers';


/**
 * Properties expected by the QGis map controller.
 */
export interface QgisMapControllerProps {
    /**
     * The initial view of the map.
     */
    initialView: ViewOptions;

    /**
     * The children of the controller.
     */
    children?: ReactNode;
};


/**
 * Internal data for the QGis map controller.
 */
interface ControllerData {

    /**
     * The HTML element that contains the map.
     */
    mapNode: HTMLDivElement | null;

    /**
     * The map openlayers instance.
     */
    map: OlMap | null;

    /**
     * The translation provider.
     */
    intl: IntlShape;

    /**
     * Whether requests are paused.
     */
    requestsPaused: boolean;

    /**
     * Are we in the process of panning the map?
     */
    panning: boolean;

    /**
     * The timeout for unpausing the requests.
     */
    unpauseTimeout: number | null;

    /**
     * Unblocks the requests.
     */
    unblockRequests: () => void;

    /**
     * Updates the map info state.
     */
    updateMapInfoState: () => void;

    /**
     * The callback to handle a full screen change.
     */
    handleFullScreenChange: undefined | (() => void);
}


/**
 * Creates an openlayers map.
 */
export function createMap(
    data: ControllerData,
    mouseState: any,
    initialView: ViewOptions,
    mapId: string
) {

    const interactions = olCreateInteractionDefaults({
        // don't create these default interactions, but create
        // them below with custom params
        dragPan: false,
        mouseWheelZoom: false,
        keyboard: false
    });
    interactions.extend([
        new OlInteractionDragPan({ kinetic: undefined }),
        new OlInteractionMouseWheelZoom(mouseState),
        new OlInteractionKeyboardZoom(),
        new OlInteractionKeyboardPan(),
    ]);

    // const controls = olCreateControlDefaults({
    //     zoom: false,
    //     attribution: false,
    //     rotateOptions: ({
    //         tipLabel: data.intl.formatMessage({
    //             id: "map.rotation.reset",
    //             defaultMessage: "Reset rotation"
    //         })
    //     })
    // });

    data.map = new OlMap({
        layers: [],
        controls: [],
        interactions: interactions,
        keyboardEventTarget: data.mapNode as HTMLElement,
        view: new OlView(initialView)
    });

    data.map.on('movestart', () => {
        data.panning = true;
        data.requestsPaused = true;
    });
    data.map.on('moveend', data.unblockRequests);
    // data.map.on('singleclick', (event) => data.onClick(0, event.originalEvent, event.pixel));

    // Set the target element to render this map into.
    data.map.setTarget(mapId);

    // Update the internal state.
    data.updateMapInfoState();
}


/**
 * Updates the internal state based on current map info.
 *
 * @param map The map.
 * @param dispatch The dispatch function.
 */
export const updateMapInfoState = (
    map: OlMap,
    dispatch: (value: any) => void
) => {
    const view = map.getView();
    const c: Coordinate = view.getCenter() || [0, 0];
    const mapSize = map.getSize();
    const size = mapSize ? {
        width: mapSize[0],
        height: mapSize[1]
    } : {
        width: 0,
        height: 0
    };
    dispatch(setMapView({
        center: c,
        zoom: view.getZoom(),
        bbox: {
            bounds: view.calculateExtent(mapSize),
            rotation: view.getRotation(),
        },
        size,
    }));
}


/**
 * The QGis map controller.
 */
export const QgisMapController: FC<QgisMapControllerProps> = (props) => {
    console.log('[QgisMapController] rendering');
    useLogChanges(props);
    const {
        initialView,
        children
    } = props;


    // Our translation provider.
    const intl = useIntl();


    // Generate a unique ID for the map.
    const mapId = useId();


    // The internal state of the map.
    const [state, dispatch] = useReducer(
        combineReducers(reducerObject), initialState, () => ({
            ...initialState,
            map: {
                ...initialState.map,
                homeView: initialView
            }
        })
    );


    // This is where we keep internal map data not suitable for state.
    const mapData = useRef<ControllerData>({
        handleFullScreenChange: undefined,
        mapNode: null,
        intl,
        map: null,
        requestsPaused: false,
        panning: false,
        unpauseTimeout: null,
        updateMapInfoState: () => {
            console.log('[QgisMapController] updateMapInfoState');
            updateMapInfoState(mapData.current.map!, dispatch)
        },
        unblockRequests: () => {
            console.log('[QgisMapController] unblockRequests');
            if (mapData.current.panning) {
                if (mapData.current.unpauseTimeout) {
                    clearTimeout(mapData.current.unpauseTimeout);
                }
                mapData.current.unpauseTimeout = setTimeout(() => {
                    mapData.current.updateMapInfoState();
                    mapData.current.requestsPaused = false;
                    // TODO redraw?
                    mapData.current.unpauseTimeout = null;
                    mapData.current.panning = false;
                }, 500) as unknown as number;
            }
        }
    });


    // Called after the div element is mounted. Creates the map.
    const mapRef = useCallbackDebugger((node: HTMLDivElement | null) => {
        console.log('[QgisMapController] mapRef receives %O', node);
        if (node === null) {
            return;
        }

        // Store the node.
        mapData.current.intl = intl;
        mapData.current.mapNode = node;

        // Create the map.
        createMap(mapData.current, state.mouse, initialView, mapId);

        // Initialize the full screen handler.
        const handleChange = () => {
            dispatch(setFullScreen(fscreen.fullscreenElement === node));
        };
        mapData.current.handleFullScreenChange = handleChange;

        // Install the full screen handler.
        fscreen.addEventListener('fullscreenchange', handleChange);
    }, [intl, state.mouse, initialView]);


    // Recreate the layers when the internal state changes.
    useEffectDebugger(() => {
        if (mapData.current.map === null) {
            return;
        }
        console.log('[QgisMapController] recreating layers ...');
        const baseLayer = state.layers.activeBase
            ? state.layers.bases[state.layers.activeBase]
            : undefined;
        GenreRegistry.i.syncLayers(
            mapData.current.map, baseLayer, state.layers.overlays
        )
        console.log(
            '[QgisMapController] after recreating map has %d layers',
            mapData.current.map.getLayers().getLength()
        )
    }, [state.layers]);


    // Callback for entering-exiting the full screen mode.
    const setFullScreenKB = useCallbackDebugger((value: boolean) => {
        // Make sure we have a map node.
        const node = mapData.current.mapNode;
        if (!node) {
            return Promise.reject();
        }

        if (value) {
            // Enter full screen mode.
            if (fscreen.fullscreenElement) {
                // Exit previous full screen, if any.
                fscreen.exitFullscreen();
                // return fscreen.exitFullscreen().then(() => {
                return fscreen.requestFullscreen(node);
                // });
            } else {
                // Not in full screen mode.
                return fscreen.requestFullscreen(node);
            }
        } else {
            // Exit full screen mode.
            if (fscreen.fullscreenElement === node) {
                return fscreen.exitFullscreen();
            }
        }

        // The state will be updated by the full screen handler.
        // dispatch(setFullScreen(value));
    }, []);


    // Compute the value that will be provided through the context.
    const value: QgisMapContext = {
        mapId,
        mapRef,
        intl,
        olMap: mapData.current.map,

        // The current parent layer used to construct the tree.
        groupLayerInTree: ROOT_LAYER_ID,

        // The callback to set the active base layer.
        setActiveBaseLayer: useCallbackDebugger((layerId: LayerID | undefined) => {
            dispatch(setActiveBaseLayer(layerId));
        }, []),

        // The callback to set the active overlay layer.
        setActiveOverlayLayer: useCallbackDebugger((layerId: LayerID | undefined) => {
            dispatch(setActiveOverlayLayer(layerId));
        }, []),

        // The callback to add a base layer.
        addBaseLayer: useCallbackDebugger((layer: MapLayer, activate?: boolean) => {
            dispatch(addBaseLayer({ layer, activate }));
        }, []),

        // The callback to remove a base layer.
        removeBaseLayer: useCallbackDebugger((layerId: string) => {
            dispatch(removeBaseLayer(layerId));
        }, []),

        // The callback to edit a base layer.
        editBaseLayer: useCallbackDebugger((layer: MapLayer, activate?: boolean) => {
            dispatch(editBaseLayer({ layer, activate }));
        }, []),

        // The callback to add an overlay layer.
        addOverlayLayer: useCallbackDebugger((layer: MapLayer, activate?: boolean) => {
            dispatch(addOverlayLayer({ layer, activate }));
        }, []),

        // The callback to remove an overlay layer.
        removeOverlayLayer: useCallbackDebugger((layerId: string) => {
            dispatch(removeOverlayLayer(layerId));
        }, []),

        // The callback to edit an overlay layer.
        editOverlayLayer: useCallbackDebugger((layer: MapLayer, activate?: boolean) => {
            dispatch(editOverlayLayer({ layer, activate }));
        }, []),

        // The callback to reorder a base layer.
        reorderOverlayLayer: useCallbackDebugger((
            layer: LayerID,
            parent: LayerID | undefined,
            index: number,
        ) => {
            dispatch(reorderOverlayLayer({ layer, parent, index }));
        }, []),

        // Callback for entering-exiting the full screen mode.
        setFullScreen: setFullScreenKB,

        // The entire state is public.
        ...state
    };

    console.log("[QgisMapController] value: %O", value);
    return (
        <QgisMapContextProvider value={value}>
            {children}
        </QgisMapContextProvider>
    );
};
