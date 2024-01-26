import { FC } from "react";

import { GeolocationData } from "./defs";
import { GeoLocationRow } from "./common-row";


/**
 * A row in the geolocation table that shows the speed.
 */
export const GeolocationSpeedRow: FC<GeolocationData> = ({
    geolocation, intl
}) => {
    const speed = geolocation!.getSpeed();
    if (speed === undefined) {
        return null;
    }
    return (
        <GeoLocationRow
            title={
                intl.formatMessage({
                    id: "map.buttons.my-loc.speed",
                    defaultMessage: "Speed [m/s]",
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

