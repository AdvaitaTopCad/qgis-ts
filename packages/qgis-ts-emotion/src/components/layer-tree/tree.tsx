import { FC, useCallback, useMemo } from "react";
import { MapLayer, ROOT_LAYER_ID, useQgisMapContext } from "@qgis-ts/react";
import { NodeApi, NodeRendererProps, Tree } from 'react-arborist';
import { v4 as uuidv4 } from 'uuid';

function Node({ node, style, dragHandle }: NodeRendererProps<any>) {
    /* This node instance can do many things. See the API reference. */
    return (
        <div style={style} ref={dragHandle} onClick={() => node.toggle()}>
            {node.isLeaf ? "🍁" : "🗀"} {node.data.name}
        </div>
    );
}


/**
 * The properties expected by the OverlayTree component.
 */
export interface OverlayTreeProps {

};


interface CreateProps<MapLayer> {
    parentId: string | null;
    parentNode: NodeApi<MapLayer> | null;
    index: number;
    type: "internal" | "leaf";
}

interface RenameProps {
    id: string;
    name: string;
    node: NodeApi<MapLayer>;
}

interface MoveProps {
    dragIds: string[];
    dragNodes: NodeApi<MapLayer>[];
    parentId: string | null;
    parentNode: NodeApi<MapLayer> | null;
    index: number;
}

interface DeleteProps {
    ids: string[];
    nodes: NodeApi<MapLayer>[];
}


/**
 * The tree of layers.
 */
export const OverlayTree: FC<OverlayTreeProps> = ({

}) => {

    // Get the map from the context.
    const { layers: {
        layerTree,
        overlays
    } } = useQgisMapContext();

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
    const onRename = useCallback(({ id, name }: RenameProps) => {

    }, []);

    // The callback for moving a layer or group.
    const onMove = useCallback(({ dragIds, parentId, index }: MoveProps) => {

    }, []);

    // The callback for deleting a layer or group.
    const onDelete = useCallback(({ ids }: DeleteProps) => {

    }, []);

    // The accessor function for the children of a layer.
    const childrenAccessor = useCallback((d: MapLayer) => (
        (layerTree[d.id] || []).map((id) => overlays[id])
    ), [layerTree, overlays]);

    // The list of top-level layers.
    const topLevelIDs = layerTree[ROOT_LAYER_ID] || [];
    const data: MapLayer[] = useMemo(() => (
        topLevelIDs.map((id) => overlays[id])
    ), [topLevelIDs, overlays]);


    return (
        <Tree<MapLayer>
            data={data}
            // initialData={data}
            childrenAccessor={childrenAccessor}
            // idAccessor?: string | ((d: T) => string);
            onCreate={onCreate}
            onRename={onRename}
            onMove={onMove}
            onDelete={onDelete}
            openByDefault={true}
            width={600}
            height={1000}
            indent={24}
            rowHeight={36}
            paddingTop={30}
            paddingBottom={10}
            padding={25 /* sets both */}
        >
            {Node}
        </Tree >
    );
};
