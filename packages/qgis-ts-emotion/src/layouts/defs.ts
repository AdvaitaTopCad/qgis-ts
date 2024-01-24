import { CSSProperties } from "react";

/**
 * The size of the component in pixels.
 */
export const barSize: number = 36;


/**
 * The predefined Z-Index values.
 */
export enum ZIndex {
    /**
     * The Z-Index of the bar.
     */
    Bar = 1000,

    /**
     * The Z-Index of the drawer.
     */
    Drawer = 1100,

    /**
     * The Z-Index of the modal.
     */
    Modal = 1200,

    /**
     * The Z-Index of the tooltip.
     */
    Tooltip = 1300,
}


/**
 * The properties expected by the various components.
 */
export interface BarProps extends CSSProperties {
    /**
     * The children of the component.
     */
    children?: React.ReactNode;
}
