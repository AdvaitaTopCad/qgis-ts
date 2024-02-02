import { FC } from "react"
import { useIntl } from "react-intl";
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { useQgisMapDisplayContext } from "@qgis-ts/react";

import { BaseButton, BaseButtonProps } from "./base";


/**
 * Shows the settings dialog.
 */
export const SettingsButton: FC<Omit<BaseButtonProps, "children">> = (props) => {
    // Get the translation function from the context.
    const { formatMessage } = useIntl();

    // Get the settings from the context.
    const {
        settingsOpen,
        setSettingsOpen,
    } = useQgisMapDisplayContext();

    return (
        <BaseButton
            tooltip={formatMessage({
                id: "map.buttons.settings",
                defaultMessage: "Show settings"
            })}
            {...props}
            onClick={() => setSettingsOpen(!settingsOpen)}
        >
            <SettingsApplicationsIcon fontSize="inherit" />
        </BaseButton>
    )
}
