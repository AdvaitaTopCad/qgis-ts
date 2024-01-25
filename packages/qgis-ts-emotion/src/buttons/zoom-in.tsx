import { FC } from "react"
import OlMap from "ol/Map";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useQgisMapContext } from "@qgis-ts/react";
import { easeOut } from "ol/easing";
import { BaseButton, BaseButtonProps } from "./base";
import { useIntl } from "react-intl";

export const deltaStep = 1;


/**
 * Changes the zoom level of the map.
 *
 * @param olMap The map to change the zoom level of.
 * @param delta The delta to apply to the current zoom level.
 */
export function changeZoom(olMap: OlMap, delta: number) {
    const view = olMap?.getView();
    if (!view) {
        return;
    }

    // Cancel any ongoing animations.
    if (view.getAnimating()) {
        view.cancelAnimations();
    }

    // Get the current zoom level.
    const currentZoom = view.getZoom();
    if (currentZoom === undefined) {
        return;
    }

    // Get a valid zoom level according to the current view constraints.
    const newZoom = view.getConstrainedZoom(currentZoom + delta);
    view.animate({
        zoom: newZoom,
        duration: 250,
        easing: easeOut,
    });
}


/**
 * Navigates to the initial view of the map.
 */
export const ZoomInButton: FC<Omit<BaseButtonProps, "children">> = (props) => {
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
