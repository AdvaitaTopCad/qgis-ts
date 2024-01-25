import { FC } from "react"
import HomeIcon from '@mui/icons-material/Home';

import { BaseButton, BaseButtonProps } from "./base";
import { useQgisMapContext } from "@qgis-ts/react";
import { useIntl } from "react-intl";


/**
 * Navigates to the initial view of the map.
 */
export const HomeButton: FC<Omit<BaseButtonProps, "children">> = (props) => {
    // Get the translation function from the context.
    const { formatMessage } = useIntl();

    // Get the map from the context.
    const { olMap, map: {
        homeView
    } } = useQgisMapContext();

    if (!olMap) {
        return null;
    }

    return (
        <BaseButton
            tooltip={formatMessage({
                id: "map.buttons.home",
                defaultMessage: "Navigate to starting location"
            })}
            {...props}
            onClick={() => {
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
