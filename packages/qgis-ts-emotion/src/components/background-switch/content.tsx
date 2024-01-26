import { FC } from "react";
import { IntlShape } from "react-intl";
import { LayerID, MapLayer } from "@qgis-ts/react";
import NoPreview from '../../assets/no-preview.jpg';

import { BackgroundCard } from "./card";


/**
 * Properties expected by the BackgroundContent component.
 */
export interface BackgroundContentProps {

    /**
     * The translation function.
     */
    formatMessage: IntlShape["formatMessage"];

    /**
     * The list of base layers.
     */
    bases: Record<LayerID, MapLayer>

    /**
     * Callback triggered when the user clicks on the card.
     */
    onSelect: (id: LayerID | undefined) => void;
}


/**
 * The content of the background switcher.
 *
 * May be used both with a dialog and with a simple container.
 */
export const BackgroundContent: FC<BackgroundContentProps> = ({
    formatMessage,
    onSelect,
    bases,
}) => (
    <>
        <BackgroundCard
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
            <BackgroundCard
                key={base.id}
                id={base.id}
                title={base.title || base.id}
                image={NoPreview}
                onSelect={onSelect}
            />
        ))}
    </>
)
