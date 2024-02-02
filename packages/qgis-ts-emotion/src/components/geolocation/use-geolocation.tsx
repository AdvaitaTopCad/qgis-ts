import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import OlMap from 'ol/Map';
import Feature from 'ol/Feature.js';
import Geolocation from 'ol/Geolocation.js';
import Point from 'ol/geom/Point.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import { useQgisOlMapContext } from "@qgis-ts/react";

import { GeolocationTable } from "./table";
import { GeolocationData } from "./defs";
import { GeolocationErrorMessage } from "./error";


/**
 * The result of the hook.
 */
export interface UseGeolocationResult {
    /**
     * The error message.
     */
    error: string | null;

    /**
     * The tooltip.
     */
    tooltip: ReactNode;

    /**
     * The click handler.
     */
    handleClick: () => void;

    /**
     * The tracking state.
     */
    tracking: boolean;

    /**
     * The openlayers map.
     */
    olMap: OlMap | null;
}


/**
 * Hook that handles the geolocation.
 */
export function useGeolocation() {
    // Internationalization provider.
    const intl = useIntl();

    // Get the map from context.
    const olMap = useQgisOlMapContext();

    // Are we tracking?
    const [tracking, setTracking] = useState(false);

    // Do we have an error?
    const [error, setError] = useState<string | null>(null);

    // The content of the tooltip.
    const [tooltip, setTooltip] = useState<ReactNode>(intl.formatMessage({
        id: "map.buttons.my-loc.tooltip",
        defaultMessage: "Click to navigate to your location.",
    }));

    // Other data is saved here.
    const data = useRef<GeolocationData>({
        olMap,
        geolocation: null,
        intl,
        layer: null,
        layerInMap: false,
        oneJumpOnly: false,
    });

    // On first render set it up.
    useEffect(() => {
        if (!olMap) return;
        // console.log("[MyLocationButton] setting up");

        const view = olMap.getView();

        // Create the wrapper for HTML5 Geolocation capabilities.
        const geolocation = new Geolocation({
            projection: view.getProjection(),
            trackingOptions: {
                // enableHighAccuracy must be set to true to have
                // the heading value.
                enableHighAccuracy: true,
                // https://stackoverflow.com/q/3752383/1742064
                maximumAge: Infinity,
                timeout: 5000,
            },
            // Do not start tracking right away.
            tracking: false,
        });
        data.current.geolocation = geolocation;
        // console.log("[MyLocationButton] geolocation created: %O", geolocation);

        // update the tooltip when the position changes.
        geolocation.on('change', function () {
            // console.log("[MyLocationButton] geolocation change");
            setError(null);
            setTooltip(
                <GeolocationTable {...data.current} />
            );
        });

        // handle geolocation error.
        geolocation.on('error', function (error) {
            // console.log("[MyLocationButton] geolocation error: %O", error);
            setError(error.message);
            setTooltip(<GeolocationErrorMessage error={error} intl={intl} />);
        });

        // Create the feature that will be used to draw the accuracy
        // marker.
        const accuracyFeature = new Feature();
        data.current.accuracyFeature = accuracyFeature;
        geolocation.on('change:accuracyGeometry', function () {
            // Update the feature when we have new accuracy data.
            const accGeom = geolocation.getAccuracyGeometry();
            if (accGeom) {
                accuracyFeature.setGeometry(accGeom);
            } else {
                accuracyFeature.setGeometry(undefined);
            }
        });

        // Create the feature that will be used to draw the position
        const positionFeature = new Feature();
        data.current.positionFeature = positionFeature;
        positionFeature.setStyle(
            new Style({
                image: new CircleStyle({
                    radius: 6,
                    fill: new Fill({
                        color: '#3399CC',
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 2,
                    }),
                }),
            })
        );
        geolocation.on('change:position', function () {
            // Update the feature when we have new position data.
            const coordinates = geolocation.getPosition();
            if (coordinates) {
                if (data.current.oneJumpOnly) {
                    data.current.oneJumpOnly = false;
                    view.setCenter(coordinates);
                    view.setZoom(17);
                }
                positionFeature.setGeometry(new Point(coordinates));
            } else {
                positionFeature.setGeometry(undefined);
            }
        });

        // Handle change of tracking.
        data.current.geolocation.on('change:tracking', function () {
            setTracking(data.current.geolocation?.getTracking() ?? false);
        });

        // Create the vector source and layer.
        data.current.layer = new VectorLayer({
            source: new VectorSource({
                features: [accuracyFeature, positionFeature],
            }),
        });

        // olMap!.addLayer(data.current.layer!);

        return () => {
            // console.log("[MyLocationButton] tearing down");
            if (olMap && data.current.layer && data.current.layerInMap) {
                olMap.removeLayer(data.current.layer);
                data.current.layer = null;
                data.current.layerInMap = false;
            }
        }
    }, [olMap]);

    // Click handler.
    const handleClick = useCallback(() => {
        // console.log("[MyLocationButton] click");
        setError(null);
        setTracking((prev) => {
            let result;
            if (!olMap) {
                result = false;
                // console.log("[MyLocationButton] click without map");
            } else if (!data.current.geolocation) {
                result = false;
                // console.log("[MyLocationButton] click without geolocation");
            } else {
                result = !prev;
                data.current.geolocation.setTracking(result);
                // console.log("[MyLocationButton] tracking: %O", result);
            }
            if (result) {
                data.current.oneJumpOnly = true;
                olMap!.addLayer(data.current.layer!);
                data.current.layerInMap = true;
                // console.log(
                //     "[MyLocationButton] the layer was added to the map" +
                //     "geolocation is %O", data.current.geolocation
                // );
            } else if (olMap && data.current.layer && data.current.layerInMap) {
                olMap.removeLayer(data.current.layer);
                data.current.layerInMap = false;
                // console.log(
                //     "[MyLocationButton] the layer was removed from the map"
                // );
                setTooltip(intl.formatMessage({
                    id: "map.buttons.my-loc.tooltip",
                    defaultMessage: "Click to navigate to your location.",
                }));
            }
            return result;
        });
    }, [olMap]);

    const result: UseGeolocationResult = {
        error,
        tooltip,
        handleClick,
        tracking,
        olMap
    };
    return result;
}
