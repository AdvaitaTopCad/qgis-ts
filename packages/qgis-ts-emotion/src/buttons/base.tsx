import { FC, ReactNode, forwardRef } from "react"
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { Tooltip } from "@mui/material";
import { useQgisMapDisplayContext } from "@qgis-ts/react";


/**
 * Properties expected by the BaseButton component.
 */
export interface BaseButtonProps extends IconButtonProps {
    /**
     * The tooltip to show for this button.
     */
    tooltip?: ReactNode;

    /**
     * The time to wait before hiding the tooltip.
     */
    leaveDelay?: number;

    /**
     * The time to wait before showing the tooltip.
     */
    enterDelay?: number;
};


/**
 * Common wrapper for all icon-buttons shown on top of the map.
 */
export const BaseButton: FC<BaseButtonProps> = forwardRef(({
    children,
    tooltip,
    leaveDelay,
    enterDelay,
    ...rest
}, ref) => {
    // Get the settings from the context.
    const { buttonSize, } = useQgisMapDisplayContext();
    // console.log("[BaseButton] buttonSize %O", buttonSize);

    return (
        tooltip ? (
            <Tooltip
                arrow
                title={tooltip}
                enterDelay={enterDelay}
                enterNextDelay={enterDelay}
                leaveDelay={leaveDelay}
            >
                <IconButton
                    color="primary"
                    size={buttonSize}
                    ref={ref}
                    {...rest}
                >
                    {children}
                </IconButton>
            </Tooltip>
        ) : (
            <IconButton
                color="primary"
                size={buttonSize}
                ref={ref}
                {...rest}
            >
                {children}
            </IconButton>
        )
    );
});
