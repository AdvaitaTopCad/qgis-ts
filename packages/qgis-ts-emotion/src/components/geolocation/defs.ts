import OlMap from "ol/Map";
import Feature from 'ol/Feature.js';
import Geolocation from 'ol/Geolocation.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import { IntlShape } from "react-intl";


/**
 * The internal data.
 */
export interface GeolocationData {
    /**
     * The map where the button is.
     */
    olMap: OlMap | null,

    /**
     * The geolocation object.
     */
    geolocation: Geolocation | null;

    /**
     * The internationalization object.
     */
    intl: IntlShape;

    /**
     * The feature used to draw the accuracy marker.
     */
    accuracyFeature?: Feature;

    /**
     * The feature used to draw the position marker.
     */
    positionFeature?: Feature;

    /**
     * The layer used to draw the accuracy and position markers.
     */
    layer: VectorLayer<VectorSource> | null;

    /**
     * True if the layer is in the map.
     */
    layerInMap: boolean;

    /**
     * When the location is activated we set this to true.
     * Then, when the first location arrive we zoom to it and set this to
     * false so that we don't zoom again.
     */
    oneJumpOnly: boolean;
}
