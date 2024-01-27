import { FC } from "react"
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useQgisOlMapContext } from "@qgis-ts/react";
import { useIntl } from "react-intl";

import { deltaStep } from "./zoom-in";
import { BaseButton, BaseButtonProps } from "./base";
import { changeZoom } from "@qgis-ts/core";


/**
 * Navigates to the initial view of the map.
 */
export const ZoomOutButton: FC<Omit<BaseButtonProps, "children">> = (props) => {
    // Get the translation function from the context.
    const { formatMessage } = useIntl();

    // Get the map from the context.
    const olMap = useQgisOlMapContext();

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
