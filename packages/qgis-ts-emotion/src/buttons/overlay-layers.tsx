import { FC } from "react"
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import { BaseButton, BaseButtonProps } from "./base";
import { useQgisMapContext } from "@qgis-ts/react";
import { useIntl } from "react-intl";


/**
 * Show the panel with overlay layers.
 */
export const OverlayLayersButton: FC<Omit<BaseButtonProps, "children">> = (
    props
) => {
    // Get the translation function from the context.
    const { formatMessage } = useIntl();

    // Get the map from the context.
    const { olMap } = useQgisMapContext();

    if (!olMap) {
        return null;
    }
    return (
        <BaseButton
            tooltip={formatMessage({
                id: "map.buttons.over-layers.tip",
                defaultMessage: "Edit layers"
            })}
            {...props}
        >
            <AccountTreeIcon />
        </BaseButton>
    )
}
