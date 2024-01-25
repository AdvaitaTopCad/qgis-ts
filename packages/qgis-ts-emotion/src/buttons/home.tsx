import { FC } from "react"
import HomeIcon from '@mui/icons-material/Home';

import { BaseButton, BaseButtonProps } from "./base";
import { useQgisMapContext } from "@qgis-ts/react";


/**
 * Navigates to the initial view of the map.
 */
export const HomeButton: FC<Omit<BaseButtonProps, "children">> = (props) => {
    const { olMap, map: {
        homeView
    } } = useQgisMapContext();

    if (!olMap) {
        return null;
    }

    return (
        <BaseButton {...props} onClick={() => {
            const view = olMap?.getView();
            if (!view) {
                return;
            }
            if (view.getAnimating()) {
                view.cancelAnimations();
            }
            view.animate(homeView);
        }}>
            <HomeIcon />
        </BaseButton>
    )
}
