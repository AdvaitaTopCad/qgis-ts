import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Feature from 'ol/Feature.js';
import Geolocation, { GeolocationError } from 'ol/Geolocation.js';
import Point from 'ol/geom/Point.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useQgisMapContext } from "@qgis-ts/react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import {
    Paper, Table, TableBody, TableCell, TableContainer,
    TableRow, Tooltip, Typography
} from "@mui/material";

import { BaseButton, BaseButtonProps } from "./base";


type Props = Omit<BaseButtonProps, "children">


/**
 * The internal data.
 */
interface GeolocationData {
    geolocation: Geolocation | null;
    intl: IntlShape;
    accuracyFeature?: Feature;
    positionFeature?: Feature;
    layer: VectorLayer<VectorSource> | null;
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
    color: "error.main",
    textAlign: "center" as const,
    fontSize: "0.75rem",
    lineHeight: "1rem",
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
        <Typography variant="body2" sx={sxError}>
            {message}
        </Typography>
    );
}


/**
 * Navigates to the location of the user.
 */
export const MyLocationButton: FC<Props> = (props) => {
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
        geolocation: null,
        intl,
        layer: null,
    });

    // On first render set it up.
    useEffect(() => {
        if (!olMap) return;
        const view = olMap.getView();

        // Create the wrapper for HTML5 Geolocation capabilities.
        const geolocation = new Geolocation({
            projection: view.getProjection(),
            trackingOptions: {
                // enableHighAccuracy must be set to true to have
                // the heading value.
                enableHighAccuracy: true,
                // maximumAge: number;
                // timeout?: number;
            },
            // Do not start tracking right away.
            tracking: false,
        });
        data.current.geolocation = geolocation;

        // update the tooltip when the position changes.
        geolocation.on('change', function () {
            setError(null);
            setTooltip(
                <GeolocationTable {...data.current} />
            );
        });

        // handle geolocation error.
        geolocation.on('error', function (error) {
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
                view.setCenter(coordinates);
                view.setZoom(17);
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
            map: olMap,
            source: new VectorSource({
                features: [accuracyFeature, positionFeature],
            }),
        });

        return () => {
            if (data.current.layer) {
                olMap.removeLayer(data.current.layer);
                data.current.layer = null;
            }
        }
    }, []);

    // Click handler.
    const handleClick = useCallback(() => {
        setError(null);
        setTracking((prev) => {
            if (!olMap) return prev;
            if (!data.current.geolocation) return prev;
            const result = !prev;

            // Toggle tracking.
            data.current.geolocation.setTracking(result);

            return result;
        });
    }, []);

    return (
        <Tooltip title={tooltip}>
            <BaseButton
                {...props}
                color={error ? "error" : (tracking ? "success" : "primary")}
                disabled={!olMap}
                onClick={handleClick}
            >
                <MyLocationIcon />
            </BaseButton>
        </Tooltip>
    )
}
