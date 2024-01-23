import { QgisMapContextProvider, useQgisMapContext } from "../map";
import { MapLayer } from "./defs";


/**
 * Properties for the MapLayerComp component.
 */
export interface MapLayerProps<T extends MapLayer> {

    /**
     * The type of the layer.
     *
     * This can be:
     * - "base" for a base layer
     * - "overlay" for an overlay layer (will be made active if
     *   there is no active overlay layer)
     * - "group" for a group layer (will be added as an overlay layer)
     * - "none" for a component that you use to organize the tree.
     */
    layerKind?: "base" | "overlay" | "group" | "none";

    /**
     * Layer settings that will be stored in the map.
     */
    settings?: T;

    /**
     * The children of the component (allows for a tree of layers).
     */
    children?: React.ReactNode;
}


/**
 * A component that adds a layer to the map.
 */
export function MapLayerComp<T extends MapLayer = MapLayer>({
    layerKind = "none",
    settings,
    children
}: MapLayerProps<T>) {
    const upperContext = useQgisMapContext();
    const {
        addOverlayLayer,
        addBaseLayer,
        groupLayerInTree,
        layers: {
            activeOverlay
        }
    } = upperContext;

    if (layerKind === "none") {
        // no need to wrap children in a provider.
        return children as JSX.Element;
    } else {
        if (!settings) {
            throw new Error("Missing settings for layer.");
        }

        // Insert the parent derived from the context.
        const adjusted = {
            ...settings,
            parent: settings.parent || groupLayerInTree
        }

        if (layerKind === "base") {
            addBaseLayer(adjusted);
            return children;
        } else if (layerKind === "overlay") {
            addOverlayLayer(adjusted, !activeOverlay);
        } else if (layerKind === "group") {
            addOverlayLayer(adjusted);
        } else {
            throw new Error(`Invalid layer kind: ${layerKind}`);
        }
    }

    if (!children) {
        return null;
    }

    return (
        <QgisMapContextProvider value={{
            ...upperContext,
            groupLayerInTree: settings.id
        }}>
            {children}
        </QgisMapContextProvider>
    );
}
