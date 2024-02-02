import { useEffect, useMemo } from "react";
import { QgisMapContextProvider, useQgisMapContext } from "../map";
import { GROUP_GENRE_ID, MapLayer, ROOT_LAYER_ID } from "./defs";
import { QgisMapLayersContextProvider, useQgisMapLayersContext } from "../map/layers-context";


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
     * Whether to activate the layer.
     */
    activate?: boolean;

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
    activate,
    settings,
    children
}: MapLayerProps<T>) {
    // console.log(
    //     "[MapLayerComp] rendering layerKind=%O, settings=%O",
    //     layerKind, settings
    // );

    const upperContext = useQgisMapLayersContext();
    const {
        addOverlayLayer,
        removeBaseLayer,
        removeOverlayLayer,
        addBaseLayer,
        groupLayerInTree,
    } = upperContext;

    // On unmount remove the layer.
    useEffect(() => {
        console.log("[MapLayerComp] useEffect");
        if (layerKind !== "none") {
            if (!settings) {
                throw new Error("Missing settings for layer.");
            }

            // Insert the parent derived from the context.
            const adjusted = {
                ...settings,
                parent: settings.parent || groupLayerInTree
            }

            if (layerKind === "base") {
                addBaseLayer(adjusted, activate);
            } else if (layerKind === "overlay") {
                addOverlayLayer(adjusted, activate);
            } else if (layerKind === "group") {
                addOverlayLayer({
                    ...adjusted,
                    genre: GROUP_GENRE_ID
                }, activate);
            } else {
                throw new Error(`Invalid layer kind: ${layerKind}`);
            }
        }

        return () => {
            console.log("[MapLayerComp] unmounting");
            if (layerKind === "base") {
                removeBaseLayer(settings!.id!);
            } else if (layerKind === "overlay") {
                removeOverlayLayer(settings!.id!);
            } else if (layerKind === "group") {
                removeOverlayLayer(settings!.id!);
            }
        }
    }, [settings, activate]);

    const contextValue = useMemo(() => ({
        ...upperContext,
        groupLayerInTree: settings?.id || ROOT_LAYER_ID
    }), [upperContext, settings?.id]);

    if (layerKind === "none" || layerKind === "base") {
        // no need to wrap children in a provider.
        return children as JSX.Element;
    }
    if (!children) {
        return null;
    }

    return (
        <QgisMapLayersContextProvider value={contextValue}>
            {children}
        </QgisMapLayersContextProvider>
    );
}
