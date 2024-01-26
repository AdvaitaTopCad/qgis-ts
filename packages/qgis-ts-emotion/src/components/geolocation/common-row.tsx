import { FC, ReactNode } from "react";
import { TableCell, TableRow, Typography } from "@mui/material";


/**
 * A row in the geolocation table.
 */
export const GeoLocationRow: FC<{ title: ReactNode; value: ReactNode; }> = ({
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
