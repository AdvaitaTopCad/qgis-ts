import {
    FC, ReactNode, useCallback, useEffect, useId, useMemo,
    useReducer, useRef
} from 'react';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';
import { get as getProjection, } from 'ol/proj';

import { combineReducers } from 'redux';
import { useIntl } from 'react-intl';
import fscreen from 'fscreen';
import Projection from "ol/proj/Projection";

import { ViewOptions } from 'ol/View';
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

import OlControlOverviewMap from 'ol/control/OverviewMap';

import { ROOT_LAYER_ID } from '../layers';
import { QgisMapContextProvider } from './general.context';
import type { QgisMapContext } from './general.context';
import { reducerObject, initialState } from './store';
import { updateMapInfoState } from './map.slice';
import { setFullScreen, useDisplaySlice } from './display.slice';
import { GenreRegistry } from '../layers';
import { ControllerData, createMap } from './create-map';
import { QgisMapMouseContextProvider } from './mouse.context';
import { QgisOlMapContextProvider } from './olmap.context';
import { useLayersSlice } from './layers.slice';
import { QgisMapLayersContextProvider } from './layers.context';
import { QgisMapViewContextProvider } from './view.context';
import { QgisMapDisplayContextProvider } from './display.context';
import { QgisMapProjContextProvider } from './proj.context';
import { ProjectionId, useProjSlice } from './proj.slice';


interface ProjectionDef {
    projDef: string;
    extent?: [number, number, number, number];
}

type InitialProjections = Record<ProjectionId, Projection | ProjectionDef>;


// Helper function for the initial values provided to the projection context.
const computeProjections = (
    values?: InitialProjections, defaults: Record<ProjectionId, Projection> = {}
) => {
    if (!values) {
        return defaults;
    }

    // Make sure that all projections are defined.
    Object.keys(
        values
    ).filter(
        key => !(values[key] instanceof Projection)
    ).forEach(
        key => { proj4.defs(key, (values[key] as ProjectionDef).projDef); }
    );

    // Make projections defined in proj4.
    register(proj4);

    // Create the projection objects.
    return Object.keys(values).reduce((acc, key) => {
        const value = values[key];
        if (value instanceof Projection) {
            acc[key] = value;
        } else {
            acc[key] = getProjection(key)!;
        }
        return acc;
    }, {} as Record<ProjectionId, Projection>);
}


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
     * The initial projection.
     *
     * @default "EPSG:4326" (that is, WGS84)
     */
    initialProjection?: ProjectionId;

    /**
     * The initial list of projections.
     *
     * The keys are the translation keys used to get the label of the
     * projection. The value may be a projection object or an object with
     * the following properties:
     * - projDef: the definition of the projection.
     * - extent: the extent of the projection.
     */
    initialProjections?: InitialProjections;

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
        initialProjections,
        initialProjection,
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
            },
            proj: {
                ...initialState.proj,
                projections: computeProjections(
                    initialProjections,
                    initialState.proj.projections
                ),
                projection: initialProjection || initialState.proj.projection
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


    // Split the state into slices.
    const {
        mouse: mouseState,
        display: displayState,
        layers: layersState,
        map: mapState,
        proj: projState
    } = state;


    // Provided both through the general context and through the layers context.
    const layersSlice = useLayersSlice(dispatch);
    const displaySlice = useDisplaySlice(dispatch);
    const projSlice = useProjSlice(dispatch);

    // Compute the value that will be provided through the context.
    const value: QgisMapContext = useMemo(() => ({
        intl,

        // Actions from the layers slice.
        ...layersSlice,

        // The entire state is public.
        map: mapState,
    }), [
        mapId, mapRef, intl, setFullScreenKB, mapState
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


    // Compute the value that will be provided through the display context.
    const displayValue = useMemo(() => {
        // console.log("[QgisMapController] displayValue: %O", displayState);
        // TODO renders too much.
        return ({
            ...displayState,
            ...displaySlice,

            // Callback for entering-exiting the full screen mode.
            setFullScreen: setFullScreenKB,
        });
    }, [displayState, displaySlice]);


    // Compute the value that will be provided through the projection context.
    const projValue = useMemo(() => {
        // console.log("[QgisMapController] projValue: %O", layersState);
        // TODO renders too much.
        return ({
            ...projState,
            ...projSlice,
        });
    }, [projState, projSlice]);


    // console.log("[QgisMapController] value: %O", value);
    return (
        <QgisMapContextProvider value={value}>
            <QgisMapDisplayContextProvider value={displayValue}>
                <QgisMapMouseContextProvider value={mouseState}>
                    <QgisMapLayersContextProvider value={layersValue}>
                        <QgisOlMapContextProvider value={mapData.current.map}>
                            <QgisMapProjContextProvider value={projValue}>
                                <QgisMapViewContextProvider value={useMemo(() => ({
                                    mapId,
                                    mapRef,
                                }), [mapId, mapRef])}>
                                    {children}
                                </QgisMapViewContextProvider>
                            </QgisMapProjContextProvider>
                        </QgisOlMapContextProvider>
                    </QgisMapLayersContextProvider>
                </QgisMapMouseContextProvider>
            </QgisMapDisplayContextProvider>
        </QgisMapContextProvider>
    );
};
