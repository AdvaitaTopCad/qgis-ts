import { FC } from "react";
import { LayerID } from "@qgis-ts/react";
import { styled } from '@mui/system';
import {
    Card, CardActionArea, CardMedia, CardProps, Typography
} from "@mui/material";

import { backgroundCardHeight, backgroundCardMargin, backgroundCardWidth } from "./defs";


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
export interface BackgroundCardProps {
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
    width: (backgroundCardWidth - backgroundCardMargin) + 'px',

    // Allow the card to grow vertically.
    minHeight: (backgroundCardHeight - backgroundCardMargin) + 'px',

    // If not the button is only shown at the top for None variant.
    height: id ? undefined : (backgroundCardHeight - backgroundCardMargin) + 'px',
    margin: backgroundCardMargin + 'px',
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
export const BackgroundCard: FC<BackgroundCardProps> = ({
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
                    height={backgroundCardHeight - 26}
                    image={image}
                    alt="preview"
                />
            ) : null}
        </CardActionArea>
    </StyledCard>
);
