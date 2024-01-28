import { FC, ReactNode, useCallback, useMemo, useState } from "react";
import { LayerID, MapLayer, ROOT_LAYER_ID, useQgisMapLayersContext } from "@qgis-ts/react";
import { v4 as uuidv4 } from 'uuid';

import { CreateProps, DeleteProps, MoveProps, RenameProps } from "./defs";
import { LayerTreeContext, LayerTreeContextProvider } from "./context"


export interface LayerTreeControllerProps {

    /**
     * The children of the controller.
     */
    children?: ReactNode;
}


/**
 * The controller for the layer tree.
 */
export const LayerTreeController: FC<LayerTreeControllerProps> = ({
    children
}) => {

    // The ID of the layer being edited.
    // If null the layer is not being edited (the tree is visible).
    const [currentLayer, setCurrentLayer] = useState<LayerID | null>(null);


    // Get the layers tree from context..
    const {
        layerTree,
        overlays,
        editOverlayLayer
    } = useQgisMapLayersContext();


    // The callback for creating a new layer or group.
    const onCreate = useCallback(({
        parentId, index, type
    }: CreateProps<MapLayer>) => {
        const id = uuidv4();
        return {
            id,
        };
    }, []);


    // The callback for renaming a layer or group.
    const onRename = useCallback(({ id, name, node }: RenameProps) => {
        console.log(
            "[OverlayTree] onRename id=%s name=%s node=%O",
            id, name, node
        );
    }, []);


    // The callback for moving a layer or group.
    const onMove = useCallback(({
        dragIds,
        dragNodes,
        parentId,
        parentNode,
        index
    }: MoveProps) => {
        console.log(
            "[OverlayTree] onMove dragIds=%O dragNodes=%O " +
            "parentId=%s parentNode=%O index=%s",
            dragIds, dragNodes, parentId, parentNode, index
        )
    }, []);


    // The callback for deleting a layer or group.
    const onDelete = useCallback(({ ids, nodes }: DeleteProps) => {
        console.log("[OverlayTree] onDelete ids=%O nodes=%O", ids, nodes);
    }, []);


    // The accessor function for the children of a layer.
    const childrenAccessor = useCallback((d: MapLayer) => {
        const result = (layerTree[d.id] || []).map((id) => overlays[id]);
        if (result.length) {
            return result;
        } else {
            return null;
        }
    }, [layerTree, overlays]);


    // The value of the context.
    const value: LayerTreeContext = useMemo(() => ({
        currentLayer,
        setCurrentLayer,
        onCreate,
        onRename,
        onMove,
        onDelete,
        childrenAccessor,
        treeData: (layerTree[ROOT_LAYER_ID] || []).map((id) => overlays[id]),
        editOverlayLayer,
        overlays,
    }), [
        currentLayer,
        setCurrentLayer,
        onCreate,
        onRename,
        onMove,
        onDelete,
        childrenAccessor,
        layerTree,
        overlays,
        editOverlayLayer,
    ]);


    return (
        <LayerTreeContextProvider value={value}>
            {children}
        </LayerTreeContextProvider>
    )
}
