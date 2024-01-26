import { FC } from "react";
import { GeolocationData } from "./defs";
import { GeoLocationRow } from "./common-row";


/**
 * A row in the geolocation table that shows the altitude.
 */
export const GeolocationAltitudeRow: FC<GeolocationData> = ({
    geolocation, intl
}) => {
    const altitude = geolocation!.getAltitude();
    const accuracy = geolocation!.getAltitudeAccuracy();
    if (altitude === undefined) {
        return null;
    }
    return (
        <GeoLocationRow
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
