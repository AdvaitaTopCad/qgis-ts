import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import OlMap from "ol/Map";
import Feature from 'ol/Feature.js';
import Geolocation, { GeolocationError } from 'ol/Geolocation.js';
import Point from 'ol/geom/Point.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useQgisMapContext } from "@qgis-ts/react";
import { IntlShape, useIntl } from "react-intl";
import {
    Box,
    Paper, Table, TableBody, TableCell, TableContainer,
    TableRow, Typography
} from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';

import { BaseButton, BaseButtonProps } from "./base";


type Props = Omit<BaseButtonProps, "children">


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


export const Row: FC<{ title: ReactNode; value: ReactNode; }> = ({
    title, value,
}) => {
    return (
        <TableRow>
            <TableCell>
                <Typography variant="body2">
                    {title}
                </Typography>
            </TableCell>
            <TableCell align="right">
                <Typography variant="body2">
                    {value}
                </Typography>
            </TableCell>
        </TableRow>
    );
}


export const PositionRow: FC<GeolocationData> = ({
    geolocation, intl
}) => {
    const coordinates = geolocation!.getPosition();
    return (
        <Row
            title={
                intl.formatMessage({
                    id: "map.buttons.my-loc.position",
                    defaultMessage: "Position",
                })
            }
            value={
                coordinates ? (
                    intl.formatNumber(coordinates[0], {
                        minimumFractionDigits: 6,
                        maximumFractionDigits: 6,
                    }) + ', ' +
                    intl.formatNumber(coordinates[1], {
                        minimumFractionDigits: 6,
                        maximumFractionDigits: 6,
                    })
                ) : ''
            }
        />
    );
}


export const AccuracyRow: FC<GeolocationData> = ({
    geolocation, intl
}) => {
    const accuracy = geolocation!.getAccuracy();
    return (
        <Row
            title={
                intl.formatMessage({
                    id: "map.buttons.my-loc.accuracy",
                    defaultMessage: "Accuracy [m]",
                })
            }
            value={
                accuracy ? (
                    intl.formatNumber(accuracy, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                    })
                ) : ''
            }
        />
    );
}


export const AltitudeRow: FC<GeolocationData> = ({
    geolocation, intl
}) => {
    const altitude = geolocation!.getAltitude();
    const accuracy = geolocation!.getAltitudeAccuracy();
    if (altitude === undefined) {
        return null;
    }
    return (
        <Row
            title={
                intl.formatMessage({
                    id: "map.buttons.my-loc.altitude",
                    defaultMessage: "Altitude [m]",
                })
            }
            value={
                altitude ? (
                    intl.formatNumber(altitude, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                    }) + ' ± ' + (accuracy ? intl.formatNumber(accuracy, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                    }) : 'N/A')
                ) : ''
            }
        />
    );
}


export const HeadingRow: FC<GeolocationData> = ({
    geolocation, intl
}) => {
    const heading = geolocation!.getHeading();
    if (heading === undefined) {
        return null;
    }
    return (
        <Row
            title={
                intl.formatMessage({
                    id: "map.buttons.my-loc.heading",
                    defaultMessage: "Heading [°]",
                })
            }
            value={
                heading ? (
                    intl.formatNumber(heading * 360 / Math.PI, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                    })
                ) : ''
            }
        />
    );
}


export const SpeedRow: FC<GeolocationData> = ({
    geolocation, intl
}) => {
    const speed = geolocation!.getSpeed();
    if (speed === undefined) {
        return null;
    }
    return (
        <Row
            title={
                intl.formatMessage({
                    id: "map.buttons.my-loc.heading",
                    defaultMessage: "Heading [m/s]",
                })
            }
            value={
                speed ? (
                    intl.formatNumber(speed, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                ) : ''
            }
        />
    );
}


export const GeolocationTable: FC<GeolocationData> = (props) => {
    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableBody>
                    <PositionRow {...props} />
                    <AccuracyRow {...props} />
                    <AltitudeRow {...props} />
                    <HeadingRow {...props} />
                    <SpeedRow {...props} />
                </TableBody>
            </Table>
        </TableContainer>
    )
}


const sxError = {
    color: "error.light",
    textAlign: "center" as const,
    fontSize: "0.75rem",
    lineHeight: "1rem",
    p: 0.5,
    mt: 0.5,
    mb: 0.5,
}


/**
 * A component that displays the geolocation error message.
 */
export const ErrorMessage: FC<{
    error: GeolocationError, intl: IntlShape
}> = ({ error, intl }) => {
    let message;
    if (error.code === 1) {
        message = intl.formatMessage({
            id: "map.buttons.my-loc.error.permission-denied",
            defaultMessage: "The page is not allowed to acquire the position.",
        });
    } else if (error.code === 2) {
        message = intl.formatMessage({
            id: "map.buttons.my-loc.error.position-unavailable",
            defaultMessage: "The position could not be acquired.",
        });
    } else if (error.code === 3) {
        message = intl.formatMessage({
            id: "map.buttons.my-loc.error.timeout",
            defaultMessage: "The request to get user location timed out.",
        });
    } else {
        message = error.message;
    }
    return (
        <Box display="flex" flexDirection="row" alignItems="center">
            <WarningIcon color="error" />
            <Typography variant="body2" sx={sxError}>
                {message}
            </Typography>
        </Box>
    );
}


/**
 * Navigates to the location of the user.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
 */
export const MyLocationButton: FC<Props> = (props) => {
    console.log("[MyLocationButton] render");

    // Internationalization provider.
    const intl = useIntl();

    // Get the map from context.
    const { olMap } = useQgisMapContext();

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
        console.log("[MyLocationButton] setting up");

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
        console.log("[MyLocationButton] geolocation created: %O", geolocation);

        // update the tooltip when the position changes.
        geolocation.on('change', function () {
            console.log("[MyLocationButton] geolocation change");
            setError(null);
            setTooltip(
                <GeolocationTable {...data.current} />
            );
        });

        // handle geolocation error.
        geolocation.on('error', function (error) {
            console.log("[MyLocationButton] geolocation error: %O", error);
            setError(error.message);
            setTooltip(<ErrorMessage error={error} intl={intl} />);
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
            console.log("[MyLocationButton] tearing down");
            if (olMap && data.current.layer && data.current.layerInMap) {
                olMap.removeLayer(data.current.layer);
                data.current.layer = null;
                data.current.layerInMap = false;
            }
        }
    }, [olMap]);

    // Click handler.
    const handleClick = useCallback(() => {
        console.log("[MyLocationButton] click");
        setError(null);
        setTracking((prev) => {
            let result;
            if (!olMap) {
                result = false;
                console.log("[MyLocationButton] click without map");
            } else if (!data.current.geolocation) {
                result = false;
                console.log("[MyLocationButton] click without geolocation");
            } else {
                result = !prev;
                data.current.geolocation.setTracking(result);
                console.log("[MyLocationButton] tracking: %O", result);
            }
            if (result) {
                data.current.oneJumpOnly = true;
                olMap!.addLayer(data.current.layer!);
                data.current.layerInMap = true;
                console.log(
                    "[MyLocationButton] the layer was added to the map" +
                    "geolocation is %O", data.current.geolocation
                );
            } else if (olMap && data.current.layer && data.current.layerInMap) {
                olMap.removeLayer(data.current.layer);
                data.current.layerInMap = false;
                console.log(
                    "[MyLocationButton] the layer was removed from the map"
                );
                setTooltip(intl.formatMessage({
                    id: "map.buttons.my-loc.tooltip",
                    defaultMessage: "Click to navigate to your location.",
                }));
            }
            return result;
        });
    }, [olMap]);

    return (
        <BaseButton
            {...props}
            color={error ? "error" : (tracking ? "success" : "primary")}
            disabled={!olMap}
            onClick={handleClick}
            tooltip={tooltip}
            leaveDelay={typeof tooltip === "string" ? 200 : 2000}
            enterDelay={typeof tooltip === "string" ? 1000 : 500}
        >
            <MyLocationIcon />
        </BaseButton>
    )
}
