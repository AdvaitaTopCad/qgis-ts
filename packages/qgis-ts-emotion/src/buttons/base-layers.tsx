import { FC, CSSProperties, useState, useRef, useCallback } from "react";
import SatelliteIcon from '@mui/icons-material/Satellite';
import { LayerID, useQgisMapContext } from "@qgis-ts/react";
import { useIntl } from "react-intl";
import { styled } from '@mui/system';
import {
    Card, CardActionArea, CardMedia, CardProps, Dialog, DialogActions, Typography
} from "@mui/material";

import { BaseButton, BaseButtonProps } from "./base";
import NoPreview from '../assets/no-preview.jpg';


// Dimensions for the background cards.
const cardWidth = 150;
const cardHeight = 80;
const cardMargin = 4;


// The style to apply to the dialog.
const sxDialog = {
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
};


// The style to apply to the title in the card.
const sxTitle = {
    pl: 1,
    pr: 1,
}


// The style to apply to the action area in the card.
const sxAction = {
    height: "100%",
}


/**
 * Properties expected by the BaseCard component.
 */
export interface BaseCardProps {
    /**
     * The unique background layer ID.
     */
    id: string | undefined;

    /**
     * The text to show to the user.
     */
    title: string;

    /**
     * The image to show as preview.
     */
    image: string | null;

    /**
     * Callback triggered when the user clicks on the card.
     */
    onSelect: (id: LayerID | undefined) => void;
}


/**
 * The outer container for the background buttons.
 */
const StyledCard = styled(Card, {
    shouldForwardProp: (prop) => (
        prop !== 'id'
    ),
    name: 'BackgroundContainer',
})<CardProps & { id: LayerID | undefined}>(({
    id,
}) => ({
    width: (cardWidth - cardMargin) + 'px',

    // Allow the card to grow vertically.
    minHeight: (cardHeight - cardMargin) + 'px',

    // If not the button is only shown at the top for None variant.
    height: id ? undefined : (cardHeight - cardMargin) + 'px',
    margin: cardMargin + 'px',
    boxSizing: "border-box",
    display: "inline-block",
    verticalAlign: "top",
    backgroundColor: "white",
    border: "1px solid black",
    borderRadius: "5px",
    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
    cursor: "pointer",
    "&:hover": {
        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
    }
}));


/**
 * A card that shows a background layer and can be clicked to select it.
 *
 * The `26` below comes from the height of the title. It should be replaced
 * with a proper calculation based on the font size / theme or something else.
 */
const BackCard: FC<BaseCardProps> = ({
    title,
    onSelect,
    id,
    image,
}) => (
    <StyledCard id={id}>
        <CardActionArea onClick={() => onSelect(id)} sx={sxAction}>
            <Typography variant="body2" component="div" sx={sxTitle}>
                {title}
            </Typography>
            {image ? (
                <CardMedia
                    component="img"
                    height={cardHeight - 26}
                    image={image}
                    alt="preview"
                />
            ) : null}
        </CardActionArea>
    </StyledCard>
);


/**
 * Properties expected by the BackgroundContainer component.
 */
export interface BackgroundContainerProps extends CSSProperties {
    /**
     * The open/close state of the background container.
     */
    open: boolean;
};


/**
 * The outer container for the background buttons.
 */
const BackgroundContainer = styled('div', {
    shouldForwardProp: (prop) => (
        prop !== 'open' &&
        prop !== 'right' &&
        prop !== 'bottom'
    ),
    name: 'BackgroundContainer',
})<BackgroundContainerProps>(({
    right,
    open,
    bottom,
}) => ({
    backgroundColor: "transparent",
    position: "absolute",
    minHeight: cardHeight,

    // This assumes that the button is placed on the right side of the map.
    bottom,
    right,

    // Flex settings.
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",

    // These are responsible for the "open from the right side" animation.
    transform: open ? "scaleX(1)" : "scaleX(0)",
    transformOrigin: "right",
    transition: "transform 0.1s",
}));



/**
 * Select current base layer.
 */
export const BaseLayersButton: FC<Omit<BaseButtonProps, "children">> = (
    props
) => {
    // Get the translation function from the context.
    const { formatMessage } = useIntl();

    // Get the map from the context.
    const {
        olMap,
        map: {
            view: {
                size
            }
        },
        layers: {
            bases
        },
        setActiveBaseLayer,
    } = useQgisMapContext();

    // The open/close state of the background container.
    const [open, setOpen] = useState<"closed" | "dialog" | "simple">("closed");

    // The reference to our button.
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Callback for closing the background container or dialog.
    const onSelect = useCallback((id: LayerID | undefined) => {
        setActiveBaseLayer(id);
        setOpen("closed");
    }, []);

    // Callback for selecting a.
    const onClose = useCallback(() => setOpen("closed"), []);

    // Callback triggered when the user clicks on the button.
    const onClick = useCallback(() => {
        setOpen(prev => {
            if (prev === "closed") {
                // The number of base layers + 1 for the "none" option.
                const itemsCount = Object.keys(bases).length + 1;

                // The total width of the container.
                const totalWidth = itemsCount * (
                    cardMargin + cardWidth + cardMargin
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
        })
    }, [olMap, size, bases]);

    // Compute the position based on the placement of the button.
    let bottom = 0;
    let right = 0;
    if (buttonRef.current) {
        bottom = (
            buttonRef.current.parentElement!.offsetHeight! -
            buttonRef.current.offsetTop -
            buttonRef.current.offsetHeight +
            cardMargin
        );
        const rect = buttonRef.current.getBoundingClientRect();
        right = rect.width;
    }

    // This will be placed either inside the dialog or inside the
    // simple container.
    const content = (
        <>
            <BackCard
                key="none"
                id={undefined}
                title={formatMessage({
                    id: "map.buttons.base-layers.none",
                    defaultMessage: "None"
                })}
                image={null}
                onSelect={onSelect}
            />
            {Object.values(bases).map((base) => (
                <BackCard
                    key={base.id}
                    id={base.id}
                    title={base.title || base.id}
                    image={NoPreview}
                    onSelect={onSelect}
                />
            ))}
        </>
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
