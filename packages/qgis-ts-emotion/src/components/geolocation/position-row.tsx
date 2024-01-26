import { FC } from "react";

import { GeoLocationRow } from "./common-row";
import { GeolocationData } from "./defs";


/**
 * A row in the geolocation table that shows the position.
 *
 * TODO: Select the number of decimal places based on the projection's units.
 */
export const GeolocationPositionRow: FC<GeolocationData> = ({
    geolocation, intl
}) => {
    const coordinates = geolocation!.getPosition();
    return (
        <GeoLocationRow
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
