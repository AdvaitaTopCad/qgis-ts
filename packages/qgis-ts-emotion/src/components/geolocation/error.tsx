import { FC } from "react";
import { GeolocationError } from 'ol/Geolocation.js';
import { IntlShape } from "react-intl";
import { Box, Typography } from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';


// The style of the error message.
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
export const GeolocationErrorMessage: FC<{
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
