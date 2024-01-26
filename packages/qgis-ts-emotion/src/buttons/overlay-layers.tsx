import { FC, useCallback, useRef, useState } from "react"
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import { BaseButton, BaseButtonProps } from "./base";
import { useQgisMapContext } from "@qgis-ts/react";
import { useIntl } from "react-intl";
import { OverlayContainer } from "../components";


/**
 * Show the panel with overlay layers.
 */
export const OverlayLayersButton: FC<Omit<BaseButtonProps, "children">> = (
    props
) => {
    // Get the translation function from the context.
    const { formatMessage } = useIntl();

    // Get the map from the context.
    const { olMap } = useQgisMapContext();

    // The open/close state of the background container.
    const [open, setOpen] = useState<"closed" | "dialog" | "simple">("closed");

    // The reference to our button.
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Callback for closing the background container or dialog.
    const onClose = useCallback(() => setOpen("closed"), []);

    // Callback triggered when the user clicks on the button.
    const onClick = useCallback(() => {
        setOpen(prev => {
            if (prev === "closed") {
                return "simple";
            } else {
                return "closed";
            }
        });
    }, [olMap]);

    // Compute the position based on the placement of the button.
    let bottom = 0;
    let right = 0;
    if (buttonRef.current) {
        bottom = (
            buttonRef.current.parentElement!.offsetHeight! -
            buttonRef.current.offsetTop -
            buttonRef.current.offsetHeight
        );
        const rect = buttonRef.current.getBoundingClientRect();
        right = rect.width;
    }


    if (!olMap) {
        return null;
    }

    return (
        <>
            <BaseButton
                ref={buttonRef}
                tooltip={formatMessage({
                    id: "map.buttons.over-layers.tip",
                    defaultMessage: "Edit layers"
                })}
                {...props}
                onClick={onClick}
            >
                <AccountTreeIcon />
            </BaseButton>
            <OverlayContainer
                open={open === "simple"}
                bottom={bottom}
                right={right}
            >

            </OverlayContainer>
        </>
    )
}
