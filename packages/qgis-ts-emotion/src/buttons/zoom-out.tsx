import { FC } from "react"
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { BaseButton, BaseButtonProps } from "./base";
import { useQgisMapContext } from "@qgis-ts/react";
import { changeZoom, deltaStep } from "./zoom-in";
import { useIntl } from "react-intl";


/**
 * Navigates to the initial view of the map.
 */
export const ZoomOutButton: FC<Omit<BaseButtonProps, "children">> = (props) => {
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
                id: "map.buttons.zoom-out",
                defaultMessage: "Zoom out"
            })}
            {...props}
            onClick={() => changeZoom(olMap, -deltaStep)}
        >
            <RemoveCircleIcon />
        </BaseButton>
    )
}
