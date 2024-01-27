import { CSSProperties, FC, PropsWithChildren } from "react";
import { Backdrop, Modal, styled } from '@mui/material';


/**
 * Properties expected by the OverlayContainer component.
 */
export interface OverlayContainerProps extends CSSProperties {
    /**
     * The open/close state of the overlay container.
     */
    open: boolean;

    /**
     * The callback to be invoked to close the pop-up.
     */
    onClose: () => void;
};


/**
 * The outer container for the overlay tree.
 */
export const OverlayContainerStyled = styled('div', {
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
export const OverlayContainer: FC<PropsWithChildren<OverlayContainerProps>> = ({
    open,
    children,
    onClose,
    ...rest
}) => {
    console.log("[OverlayContainer] renders");

    return (
        <Modal open={open} onClose={onClose} slotProps={slotProps}>
            <OverlayContainerStyled
                open={open}
                {...(rest as any)}
            >
                {children}
            </OverlayContainerStyled>
        </Modal>
    );
}
