import { FC } from "react"
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import { BaseButton, BaseButtonProps } from "./base";


/**
 * Show the panel with overlay layers.
 */
export const OverlayLayersButton: FC<Omit<BaseButtonProps, "children">> = (
    props
) => {
    return (
        <BaseButton {...props}>
            <AccountTreeIcon />
        </BaseButton>
    )
}
