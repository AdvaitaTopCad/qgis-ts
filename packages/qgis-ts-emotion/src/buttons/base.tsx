import { Children, FC } from "react"
import IconButton, { IconButtonProps } from '@mui/material/IconButton';


/**
 * Properties expected by the BaseButton component.
 */
export interface BaseButtonProps extends IconButtonProps {};


/**
 * Common wrapper for all icon-buttons shown on top of the map.
 */
export const BaseButton: FC<BaseButtonProps> = ({
    children,
    ...rest
}) => (
    <IconButton color="primary" size="small" {...rest}>
        {children}
    </IconButton>
)
