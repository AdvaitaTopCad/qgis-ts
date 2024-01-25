import { FC } from "react";
import SatelliteIcon from '@mui/icons-material/Satellite';
import { BaseButton, BaseButtonProps } from "./base";
import { useQgisMapContext } from "@qgis-ts/react";


/**
 * Select current base layer.
 */
export const BaseLayersButton: FC<Omit<BaseButtonProps, "children">> = (
    props
) => {
    const { olMap } = useQgisMapContext();

    return (
        <BaseButton {...props} onClick={() => olMap?.getView()}>
            <SatelliteIcon />
        </BaseButton>
    )
}
