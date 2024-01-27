import { CSSProperties } from "react";
import { styled } from '@mui/material';


/**
 * Properties expected by the OverlayContainer component.
 */
export interface OverlayContainerProps extends CSSProperties {
    /**
     * The open/close state of the overlay container.
     */
    open: boolean;
};


/**
 * The outer container for the overlay tree.
 */
export const OverlayContainer = styled('div', {
    shouldForwardProp: (prop) => (
        prop !== 'open' &&
        prop !== 'right' &&
        prop !== 'bottom'
    ),
    name: 'OverlayContainer',
})<OverlayContainerProps>(({
    open,
    right,
    bottom,
    theme,
}) => {
    console.log("[OverlayContainer] renders");

    return ({
        backgroundColor: theme.palette.background.paper,
        position: "absolute",
        borderRadius: 4,
        boxShadow: "10px 10px 10px -4px lightblue",
        minWidth: 100,
        minHeight: 100,
        padding: 2,

        // This assumes that the button is placed on the right side of the map.
        bottom,
        right,

        // These are responsible for the "open from the right side" animation.
        transform: open ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "right",
        transition: "transform 0.1s",

    })
});
