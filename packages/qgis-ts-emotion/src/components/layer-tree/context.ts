import { LayerID, LayersState, MapLayer, QgisMapLayersContext } from "@qgis-ts/react";
import { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";
import { CreateProps, DeleteProps, IdObj, MoveProps, RenameProps } from "./defs";


/**
 * The openlayers map instance.
 */
export interface LayerTreeContext {
    /**
     * The callback for retrieving the children of a node.
     */
    childrenAccessor: (node: MapLayer) => (MapLayer[] | null);

    /**
     * The top level nodes of the tree.
     */
    treeData: MapLayer[];

    /**
     * All layers indexed by their IDs.
     */
    overlays: LayersState["overlays"];

    /**
     * The layer that is currently being edited or null if no layer
     * is being edited.
     */
    currentLayer: LayerID | null

    /**
     * Set the layer that is being edited or null if no layer is being edited
     * and the tree should be visible.
     */
    setCurrentLayer: Dispatch<SetStateAction<LayerID | null>>

    /**
     * The callback used to create new nodes in the tree.
     */
    onCreate: (props: CreateProps<MapLayer>) => IdObj;

    /**
     * The callback used to rename nodes in the tree.
     */
    onRename: (props: RenameProps) => void;

    /**
     * The callback used to move nodes in the tree.
     */
    onMove: (props: MoveProps) => void;

    /**
     * The callback used to delete nodes in the tree.
     */
    onDelete: (props: DeleteProps) => void;

    /**
     * The callback for editing the properties of a layer.
     */
    editOverlayLayer: QgisMapLayersContext["editOverlayLayer"]
};


// The context object.
const theContext = createContext<LayerTreeContext | null>(null);


/**
 * The provider used to wrap react component to allow them access to
 * map data.
 */
export const LayerTreeContextProvider = theContext.Provider;


/**
 * The hook to use for retrieving the data about the tree.
 */
export const useLayerTreeContext = () => {
    const context = useContext(theContext);
    if (context === null) {
        throw new Error('LayerTreeContextProvider not found');
    }

    return context;
}
