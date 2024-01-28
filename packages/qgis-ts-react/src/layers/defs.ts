import { Options as LayerOptions} from 'ol/layer/Base';
import type { GenreID } from "./genres/base";


/**
 * The unique identifier of a map layer.
 */
export type LayerID = string;


/**
 * The unique identifier of the root layer.
 */
export const ROOT_LAYER_ID: LayerID = '_ro_ot_';



/**
 * The genre for group layers.
 */
export const GROUP_GENRE_ID: GenreID = '_gr_oup_';


/**
 * Information about a layer in a map.
 *
 * One such layer may generate 0 or more ol layers.
 */
export interface MapLayer extends Omit<LayerOptions, "properties" | "className"> {
    /**
     * The ID of the layer.
     */
    id: LayerID;

    /**
     * The label of the layer.
     */
    title: LayerID;

    /**
     * The ID of the genre of this layer.
     */
    genre: GenreID;

    /**
     * The ID of the parent group.
     */
    parent?: LayerID;
}
