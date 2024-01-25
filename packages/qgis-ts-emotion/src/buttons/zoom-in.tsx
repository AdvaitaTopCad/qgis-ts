import { FC } from "react"
import OlMap from "ol/Map";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useQgisMapContext } from "@qgis-ts/react";
import { easeOut } from "ol/easing";
import { BaseButton, BaseButtonProps } from "./base";

export const deltaStep = 1;

export function changeZoom(olMap: OlMap, delta: number) {
    const view = olMap?.getView();
    if (!view) {
        return;
    }
    if (view.getAnimating()) {
        view.cancelAnimations();
    }
    const currentZoom = view.getZoom();
    if (currentZoom === undefined) {
        return;
    }
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
    const { olMap } = useQgisMapContext();

    if (!olMap) {
        return null;
    }

    return (
        <BaseButton {...props} onClick={() => changeZoom(olMap, deltaStep)}>
            <AddCircleIcon />
        </BaseButton>
    )
}
