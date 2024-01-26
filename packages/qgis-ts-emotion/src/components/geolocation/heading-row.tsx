import { FC } from "react";

import { GeolocationData } from "./defs";
import { GeoLocationRow } from "./common-row";


/**
 * A row in the geolocation table that shows the direction of movement.
 */
export const GeolocationHeadingRow: FC<GeolocationData> = ({
    geolocation, intl
}) => {
    const heading = geolocation!.getHeading();
    if (heading === undefined) {
        return null;
    }
    return (
        <GeoLocationRow
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
