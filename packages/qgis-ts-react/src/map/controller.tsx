import {
    FC, ReactNode, useCallback, useEffect, useId, useMemo,
    useReducer, useRef
} from 'react';
import { useMemoDebugger } from 'use-debugger-hooks';
import { combineReducers } from 'redux';
import { IntlShape, useIntl } from 'react-intl';
import fscreen from 'fscreen';

import OlView, { ViewOptions } from 'ol/View';
import { Coordinate } from 'ol/coordinate';
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
    Options as MouseWheelOptions
} from 'ol/interaction/MouseWheelZoom';
import OlInteractionSelect from 'ol/interaction/Select';
import OlInteractionSnap from 'ol/interaction/Snap';
// import OlInteractionTransform from 'ol-ext/interaction/Transform';
import OlInteractionTranslate from 'ol/interaction/Translate';

import { defaults as olCreateControlDefaults } from 'ol/control';
import OlControlOverviewMap from 'ol/control/OverviewMap';
import OlControlScaleLine from 'ol/control/ScaleLine';
import OlControlZoom from 'ol/control/Zoom';

import { ROOT_LAYER_ID } from '../layers';
import { QgisMapContextProvider } from './general-context';
import type { QgisMapContext } from './general-context';
import { reducerObject, initialState } from './store';
import { updateMapInfoState } from './map.slice';
import { setFullScreen } from './display.slice';
import { GenreRegistry } from '../layers';
import { ControllerData, createMap } from './create-map';
import { QgisMapMouseContextProvider } from './mouse-context';
import { QgisOlMapContextProvider } from './olmap-context';
import { useLayersSlice } from './layers.slice';
import { QgisMapLayersContextProvider } from './layers-context';
import { QgisMapViewContextProvider } from './view-context';


/**
 * Properties expected by the QGis map controller.
 */
export interface QgisMapControllerProps {

    /**
     * Should the map update its internal state on mouse move?
     *
     * If true the position of the mouse pointer will be available in the
     * context.
     *
     * @default true
     */
    trackMousePos?: boolean;

    /**
     * The initial view of the map.
     */
    initialView: ViewOptions;

    /**
     * Mouse wheel interaction options.
     */
    mouseWheelOptions?: MouseWheelOptions;

    /**
     * The children of the controller.
     */
    children?: ReactNode;
};


const defaultMouseWheelOptions: MouseWheelOptions = {
    onFocusOnly: false,
    maxDelta: 1,
    duration: 250,
    timeout: 80,
    useAnchor: true,
    constrainResolution: false,
};


/**
 * The QGis map controller.
 */
export const QgisMapController: FC<QgisMapControllerProps> = (props) => {
    // console.log('[QgisMapController] rendering');
    const {
        initialView,
        mouseWheelOptions = defaultMouseWheelOptions,
        trackMousePos = true,
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
            },
            mouse: {
                ...initialState.mouse,
                tracking: trackMousePos
            }
        })
    );


    // This is where we keep internal map data not suitable for state.
    const mapData = useRef<ControllerData>({
        dispatch,
        handleFullScreenChange: undefined,
        mapNode: null,
        intl,
        map: null,
        requestsPaused: false,
        panning: false,
        unpauseTimeout: null,
        unblockRequests: () => {
            console.log('[QgisMapController] unblockRequests');
            if (mapData.current.panning) {
                if (mapData.current.unpauseTimeout) {
                    clearTimeout(mapData.current.unpauseTimeout);
                }
                mapData.current.unpauseTimeout = setTimeout(() => {
                    updateMapInfoState(
                        mapData.current.map!,
                        mapData.current.dispatch
                    );
                    mapData.current.requestsPaused = false;
                    // TODO redraw?
                    mapData.current.unpauseTimeout = null;
                    mapData.current.panning = false;
                }, 500) as unknown as number;
            }
        },
    });


    // Called after the div element is mounted. Creates the map.
    const mapRef = useCallback((node: HTMLDivElement | null) => {
        console.log('[QgisMapController] mapRef receives %O', node);
        if (node === null) {
            return;
        }

        // Store the node.
        mapData.current.intl = intl;
        mapData.current.mapNode = node;

        // Create the map.
        createMap(mapData.current, mouseWheelOptions, initialView, mapId);

        // Initialize the full screen handler.
        const handleChange = () => {
            dispatch(setFullScreen(fscreen.fullscreenElement === node));
        };
        mapData.current.handleFullScreenChange = handleChange;

        // Install the full screen handler.
        fscreen.addEventListener('fullscreenchange', handleChange);
    }, [intl, mouseWheelOptions, initialView]);


    // Recreate the layers when the internal state changes.
    useEffect(() => {
        if (mapData.current.map === null) {
            return;
        }
        console.log('[QgisMapController] recreating layers ...');
        const baseLayer = state.layers.activeBase
            ? state.layers.bases[state.layers.activeBase]
            : undefined;
        GenreRegistry.i.syncLayers(
            mapData.current.map, baseLayer, state.layers.overlays
        );
        console.log(
            '[QgisMapController] after recreating map has %d layers',
            mapData.current.map.getLayers().getLength()
        );
    }, [state.layers]);


    // Callback for entering-exiting the full screen mode.
    const setFullScreenKB = useCallback((value: boolean) => {
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


    const {
        mouse: mouseState,
        display: displayState,
        layers: layersState,
        map: mapState
    } = state;


    // Provided both through the general context and through the layers context.
    const layersSlice = useLayersSlice(dispatch);


    // Compute the value that will be provided through the context.
    const value: QgisMapContext = useMemo(() => ({
        intl,

        // Actions from the layers slice.
        ...layersSlice,

        // Callback for entering-exiting the full screen mode.
        setFullScreen: setFullScreenKB,

        // The entire state is public.
        display: displayState,
        map: mapState,
    }), [
        mapId, mapRef, intl, setFullScreenKB, displayState, mapState
    ]) as QgisMapContext;

    // Compute the value that will be provided through the layers context.
    const layersValue = useMemo(() => {
        console.log("[QgisMapController] layersValue: %O", layersState);
        return ({
            ...layersState,
            ...layersSlice,

            // The current parent layer used to construct the tree.
            groupLayerInTree: ROOT_LAYER_ID,
        });
    }, [layersState, layersSlice]);

    
    // console.log("[QgisMapController] value: %O", value);
    return (
        <QgisMapContextProvider value={value}>
            <QgisMapMouseContextProvider value={mouseState}>
                <QgisMapLayersContextProvider value={layersValue}>
                    <QgisOlMapContextProvider value={mapData.current.map}>
                        <QgisMapViewContextProvider value={useMemo(() => ({
                            mapId,
                            mapRef,
                        }), [mapId, mapRef])}>
                            {children}
                        </QgisMapViewContextProvider>
                    </QgisOlMapContextProvider>
                </QgisMapLayersContextProvider>
            </QgisMapMouseContextProvider>
        </QgisMapContextProvider>
    );
};
