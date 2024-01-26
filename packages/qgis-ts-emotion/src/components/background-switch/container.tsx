import { CSSProperties } from "react";
import { styled } from '@mui/system';
import { backgroundCardHeight } from "./defs";


/**
 * Properties expected by the BackgroundContainer component.
 */
export interface BackgroundContainerProps extends CSSProperties {
    /**
     * The open/close state of the background container.
     */
    open: boolean;
};


/**
 * The outer container for the background buttons.
 */
export const BackgroundContainer = styled('div', {
    shouldForwardProp: (prop) => (
        prop !== 'open' &&
        prop !== 'right' &&
        prop !== 'bottom'
    ),
    name: 'BackgroundContainer',
})<BackgroundContainerProps>(({
    right,
    open,
    bottom,
}) => ({
    backgroundColor: "transparent",
    position: "absolute",
    minHeight: backgroundCardHeight,

    // This assumes that the button is placed on the right side of the map.
    bottom,
    right,

    // Flex settings.
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",

    // These are responsible for the "open from the right side" animation.
    transform: open ? "scaleX(1)" : "scaleX(0)",
    transformOrigin: "right",
    transition: "transform 0.1s",
}));
