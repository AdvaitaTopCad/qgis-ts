/**
 * The unique identifier of a map layer.
 */
export type LayerID = string;


/**
 * The unique identifier of the root layer.
 */
export const ROOT_LAYER_ID: LayerID = '_ro_ot_';


/**
 * Information about a layer in a map.
 *
 * One such layer may generate 0 or more ol layers.
 */
export interface MapLayer {
    /**
     * The ID of the layer.
     */
    id: LayerID;

    /**
     * The ID of the parent group.
     */
    parent?: LayerID;
}
