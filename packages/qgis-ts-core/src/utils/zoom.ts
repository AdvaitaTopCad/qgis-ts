import OlMap from "ol/Map";
import { easeOut } from "ol/easing";


/**
 * Changes the zoom level of the map.
 *
 * @param olMap The map to change the zoom level of.
 * @param delta The delta to apply to the current zoom level.
 */
export function changeZoom(olMap: OlMap, delta: number) {
    const view = olMap?.getView();
    if (!view) {
        return;
    }

    // Cancel any ongoing animations.
    if (view.getAnimating()) {
        view.cancelAnimations();
    }

    // Get the current zoom level.
    const currentZoom = view.getZoom();
    if (currentZoom === undefined) {
        return;
    }

    // Get a valid zoom level according to the current view constraints.
    const newZoom = view.getConstrainedZoom(currentZoom + delta);
    view.animate({
        zoom: newZoom,
        duration: 250,
        easing: easeOut,
    });
}
