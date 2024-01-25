import { FC } from "react"
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { BaseButton, BaseButtonProps } from "./base";
import { useQgisMapContext } from "@qgis-ts/react";
import { changeZoom, deltaStep } from "./zoom-in";


/**
 * Navigates to the initial view of the map.
 */
export const ZoomOutButton: FC<Omit<BaseButtonProps, "children">> = (props) => {
    const { olMap } = useQgisMapContext();

    if (!olMap) {
        return null;
    }

    return (
        <BaseButton {...props} onClick={() => changeZoom(olMap, -deltaStep)}>
            <RemoveCircleIcon />
        </BaseButton>
    )
}
