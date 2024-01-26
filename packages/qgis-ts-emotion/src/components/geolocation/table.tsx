import { FC } from "react";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";

import { GeolocationPositionRow } from "./position-row";
import { GeolocationAccuracyRow } from "./accuracy-row";
import { GeolocationAltitudeRow } from "./altitude-row";
import { GeolocationHeadingRow } from "./heading-row";
import { GeolocationSpeedRow } from "./speed-row";
import { GeolocationData } from "./defs";


/**
 * A table with geolocation data.
 */
export const GeolocationTable: FC<GeolocationData> = (props) => {
    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableBody>
                    <GeolocationPositionRow {...props} />
                    <GeolocationAccuracyRow {...props} />
                    <GeolocationAltitudeRow {...props} />
                    <GeolocationHeadingRow {...props} />
                    <GeolocationSpeedRow {...props} />
                </TableBody>
            </Table>
        </TableContainer>
    )
}
