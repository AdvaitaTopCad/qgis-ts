import { Tooltip } from "@mui/material";
import { useQgisMapContext } from "@qgis-ts/react";
import { FC } from "react";
import { useIntl } from "react-intl";
import { styled } from '@mui/system';


/**
 * Properties expected by the FullScreenSwitcher component
 */
export interface FullScreenSwitcherProps {
    side?: "tl" | "tr" | "bl" | "br";
}

const StyledButton = styled("button", {
    shouldForwardProp: (prop) => (
        prop !== 'side' && prop !== 'fullScreen'
    ),
    name: 'FullScreenButton',
})<FullScreenSwitcherProps & { fullScreen: boolean }>(({
    side,
    fullScreen,
}) => ({
    width: "32px",
    height: "32px",
    padding: 0,
    margin: 0,
    zIndex: 6000,

    // Position the button in the corner.
    position: "absolute",
    top: (side === "tl" || side === "tr") ? 0 : undefined,
    bottom: (side === "bl" || side === "br") ? 0 : undefined,
    left: (side === "tl" || side === "bl") ? 0 : undefined,
    right: (side === "tr" || side === "br") ? 0 : undefined,

    // Style it.
    border: "none",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    cursor: "pointer",

    // Draw a triangle in that corner.
    clipPath: side === "tl" ? (
        fullScreen
            ? "polygon(100% 100%, 60% 100%, 100% 60%)"
            : "polygon(0 0, 60% 0, 0 60%)"
    ) : (
        side === "tr" ? (
            fullScreen
                ? "polygon(0 100%, 40% 100%, 0 60%)"
                : "polygon(100% 0, 40% 0, 100% 60%)"
        ) : (
            side === "bl" ? (
                fullScreen
                    ? "polygon(100% 0, 60% 0, 100% 40%)"
                    : "polygon(0 100%, 60% 100%, 0 40%)"
            ) : (
                fullScreen
                    ? "polygon(0 0, 40% 0, 0 40%)"
                    : "polygon(100% 100%, 40% 100%, 100% 40%)"
            )
        )
    ),
    "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
}));



/**
 * A button to switch between full screen and normal mode.
 */
export const FullScreenSwitcher: FC<FullScreenSwitcherProps> = ({
    side = "tr"
}) => {
    // Get the map from the context.
    const { display: { fullScreen }, setFullScreen } = useQgisMapContext();

    // Internationalization provider.
    const { formatMessage } = useIntl();

    return (
        <Tooltip title={formatMessage({
            id: "map.buttons.full_screen",
            defaultMessage: "Switch between full screen and normal mode"
        })}>
            <StyledButton
                side={side}
                fullScreen={fullScreen}
                onClick={() => setFullScreen(true)}
            />
        </Tooltip>
    )
}
