import { FC, useId } from "react";
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import { useQgisMapDisplayContext } from "@qgis-ts/react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useIntl } from "react-intl";
import { styled } from "@mui/material";


const StyledDrawer = styled(Drawer)(({ theme }) => ({
    zIndex: theme.zIndex.drawer,
    ".MuiPaper-root": {
        minWidth: 300,
        margin: theme.spacing(1),
        padding: theme.spacing(2),
        borderRadius: theme.spacing(1),
        boxSize: "border-box",
    }
}));


/**
 * Properties expected by the SettingsDrawer component.
 */
export interface SettingsDrawerProps extends DrawerProps {

}


/**
 * The SettingsDrawer component allows the user to edit the map settings.
 */
export const SettingsDrawer: FC<SettingsDrawerProps> = ({
    ...rest
}) => {
    const changeButtonId = useId();

    const { formatMessage } = useIntl();

    const {
        settingsOpen,
        setSettingsOpen,
        buttonSize,
        setButtonSize,
    } = useQgisMapDisplayContext();

    const changeButtonSize = (event: SelectChangeEvent) => {
        setButtonSize(event.target.value as any);
    }

    const label = formatMessage({
        id: 'map.settings.buttonSize',
        defaultMessage: 'Button size',
    });

    return (
        <StyledDrawer
            anchor="right"
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            {...rest}
        >
            <Box>
                <FormControl fullWidth size="small">
                    <InputLabel id={changeButtonId + "-label"}>
                        {label}
                    </InputLabel>
                    <Select
                        labelId={changeButtonId + "-label"}
                        id={changeButtonId}
                        value={buttonSize}
                        label={label}
                        onChange={changeButtonSize}
                    >
                        <MenuItem value={"small"}>
                            {formatMessage({
                                id: 'map.settings.buttonSize.small',
                                defaultMessage: 'Small',
                            })}
                        </MenuItem>
                        <MenuItem value={"medium"}>
                            {formatMessage({
                                id: 'map.settings.buttonSize.small',
                                defaultMessage: 'Medium',
                            })}
                        </MenuItem>
                        <MenuItem value={"large"}>
                            {formatMessage({
                                id: 'map.settings.buttonSize.small',
                                defaultMessage: 'Large',
                            })}
                        </MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </StyledDrawer>
    )
}
