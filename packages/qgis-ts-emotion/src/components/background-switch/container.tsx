import { CSSProperties, FC, PropsWithChildren } from "react";
import { styled } from '@mui/system';

import { backgroundCardHeight } from "./defs";
import Modal from "@mui/material/Modal";


/**
 * Properties expected by the BackgroundContainer component.
 */
export interface BackgroundContainerProps extends CSSProperties {
    /**
     * The open/close state of the background container.
     */
    open: boolean;

    /**
     * The callback to be invoked to close the pop-up.
     */
    onClose: () => void;
};


/**
 * The outer container for the background buttons.
 */
export const BackgroundContainerStyled = styled('div', {
    shouldForwardProp: (prop) => (
        prop !== 'open' &&
        prop !== 'right' &&
        prop !== 'bottom'
    ),
    name: 'BackgroundContainer',
})<BackgroundContainerProps>(({
    open,
    right,
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


// We only want the click-away behavior for the backdrop.
const slotProps = {
    backdrop: {
        sx: {
            backgroundColor: "transparent",
        },
    },
};


/**
 * The outer container for the overlay tree that includes a backdrop.
 */
export const BackgroundContainer: FC<
    PropsWithChildren<BackgroundContainerProps>
> = ({
    open,
    children,
    onClose,
    ...rest
}) => {
        console.log("[OverlayContainer] renders");

        return (
            <Modal open={open} onClose={onClose} slotProps={slotProps}>
                <BackgroundContainerStyled
                    open={open}
                    {...(rest as any)}
                >
                    {children}
                </BackgroundContainerStyled>
            </Modal>
        );
    }
