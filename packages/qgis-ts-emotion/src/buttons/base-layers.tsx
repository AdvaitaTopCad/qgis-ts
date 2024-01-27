import { FC, useState, useRef, useCallback } from "react";
import SatelliteIcon from '@mui/icons-material/Satellite';
import { LayerID, useQgisMapContext, useQgisMapLayersContext, useQgisOlMapContext } from "@qgis-ts/react";
import { useIntl } from "react-intl";
import { Dialog, DialogActions } from "@mui/material";

import {
    BackgroundContainer, BackgroundContent,
    backgroundCardMargin, backgroundCardWidth
} from "../components";
import { BaseButton, BaseButtonProps } from "./base";



// The style to apply to the dialog.
const sxDialog = {
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
};


/**
 * Select current base layer.
 */
export const BaseLayersButton: FC<Omit<BaseButtonProps, "children">> = (
    props
) => {
    // Get the translation function from the context.
    const { formatMessage } = useIntl();

    // Get the map from the context.
    const olMap = useQgisOlMapContext();
    const { bases } = useQgisMapLayersContext();
    const {
        map: {
            view: {
                size
            }
        },
        setActiveBaseLayer,
    } = useQgisMapContext();

    // The open/close state of the background container.
    const [open, setOpen] = useState<"closed" | "dialog" | "simple">("closed");

    // The reference to our button.
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Callback for selecting an item and closing the container.
    const onSelect = useCallback((id: LayerID | undefined) => {
        setActiveBaseLayer(id);
        setOpen("closed");
    }, []);

    // Callback for closing the background container or dialog.
    const onClose = useCallback(() => setOpen("closed"), []);

    // Callback triggered when the user clicks on the button.
    const onClick = useCallback(() => {
        setOpen(prev => {
            if (prev === "closed") {
                // The number of base layers + 1 for the "none" option.
                const itemsCount = Object.keys(bases).length + 1;

                // The total width of the container.
                const totalWidth = itemsCount * (
                    backgroundCardMargin +
                    backgroundCardWidth +
                    backgroundCardMargin
                );

                // If the total length is larger than the map width,
                // we need the dialog.
                if (totalWidth + 40 > size.width) {
                    return "dialog";
                }

                return "simple";
                // return "dialog";
            } else {
                return "closed";
            }
        });
    }, [olMap, size, bases]);

    // Compute the position based on the placement of the button.
    let bottom = 0;
    let right = 0;
    if (buttonRef.current) {
        bottom = (
            buttonRef.current.parentElement!.offsetHeight! -
            buttonRef.current.offsetTop -
            buttonRef.current.offsetHeight +
            backgroundCardMargin
        );
        const rect = buttonRef.current.getBoundingClientRect();
        right = rect.width;
    }

    // This will be placed either inside the dialog or inside the
    // simple container.
    const content = (
        <BackgroundContent
            formatMessage={formatMessage}
            onSelect={onSelect}
            bases={bases}
        />
    );

    return (
        <>
            <BaseButton
                ref={buttonRef}
                tooltip={formatMessage({
                    id: "map.buttons.base-layers.tip",
                    defaultMessage: "Change background"
                })}
                {...props}
                onClick={onClick}
            >
                <SatelliteIcon />
            </BaseButton>
            <BackgroundContainer
                open={open === "simple"}
                onClose={onClose}
                bottom={bottom}
                right={right}
            >
                {content}
            </BackgroundContainer>
            <Dialog
                open={open === "dialog"}
                onClose={onClose}
                fullWidth
                maxWidth="lg"
            >
                <DialogActions sx={sxDialog}>
                    {content}
                </DialogActions>
            </Dialog>
        </>
    );
}
