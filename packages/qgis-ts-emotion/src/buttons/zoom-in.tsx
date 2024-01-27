import { FC } from "react"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useQgisOlMapContext } from "@qgis-ts/react";
import { BaseButton, BaseButtonProps } from "./base";
import { useIntl } from "react-intl";
import { changeZoom } from "@qgis-ts/core";

export const deltaStep = 1;



/**
 * Navigates to the initial view of the map.
 */
export const ZoomInButton: FC<Omit<BaseButtonProps, "children">> = (props) => {
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
                id: "map.buttons.zoom-in",
                defaultMessage: "Zoom in"
            })}
            {...props}
            onClick={() => changeZoom(olMap, deltaStep)}
        >
            <AddCircleIcon />
        </BaseButton>
    )
}
