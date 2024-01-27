import { Dispatch } from 'react';
import OlMap from 'ol/Map';
import OlView, { ViewOptions } from 'ol/View';
import { defaults as olCreateInteractionDefaults } from 'ol/interaction';
import OlInteractionDragPan from 'ol/interaction/DragPan';
import OlInteractionKeyboardPan from 'ol/interaction/KeyboardPan';
import OlInteractionKeyboardZoom from 'ol/interaction/KeyboardZoom';
import { IntlShape } from 'react-intl';
import OlInteractionMouseWheelZoom, {
    Options as MouseWheelOptions
} from 'ol/interaction/MouseWheelZoom';
import { v4 as uuidv4 } from 'uuid';

import { updateMapInfoState } from './map.slice';
import { setMousePos } from './mouse.slice';


/**
 * Internal data for the QGis map controller.
 */
export interface ControllerData {
    /**
     * The redux dispatch function.
     */
    dispatch: Dispatch<any>;

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
     *
     * TODO: this may not be necessary as the mouse move event already
     *      indicates if the map is being panned.
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
     * The callback to handle a full screen change.
     */
    handleFullScreenChange: undefined | (() => void);
}


/**
 * Creates an openlayers map.
 */
export function createMap(
    data: ControllerData,
    mouseWheelOptions: MouseWheelOptions,
    initialView: ViewOptions,
    mapId: string
) {
    const mapUnique = uuidv4();

    const interactions = olCreateInteractionDefaults({
        // don't create these default interactions, but create
        // them below with custom params
        dragPan: false,
        mouseWheelZoom: false,
        keyboard: false
    });
    interactions.extend([
        new OlInteractionDragPan({ kinetic: undefined }),
        new OlInteractionMouseWheelZoom(mouseWheelOptions),
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
    data.map.set('mapUnique', mapUnique);

    data.map.on('movestart', () => {
        data.panning = true;
        data.requestsPaused = true;
    });
    data.map.on('moveend', data.unblockRequests);
    // data.map.on('singleclick', (event) => data.onClick(0, event.originalEvent, event.pixel));

    data.map.on('pointermove', (event) => {
        if (!data.panning) {
            data.dispatch(setMousePos(event));
        }
    });


    // Set the target element to render this map into.
    data.map.setTarget(mapId);

    // Update the internal state.
    updateMapInfoState(data.map, data.dispatch);

    console.log("The %s map was created.", mapUnique);
}
