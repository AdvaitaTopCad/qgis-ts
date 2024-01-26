import { FC } from "react";

import { GeolocationData } from "./defs";
import { GeoLocationRow } from "./common-row";


/**
 * A row in the geolocation table that shows the horizontal accuracy.
 */
export const GeolocationAccuracyRow: FC<GeolocationData> = ({
    geolocation, intl
}) => {
    const accuracy = geolocation!.getAccuracy();
    return (
        <GeoLocationRow
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
