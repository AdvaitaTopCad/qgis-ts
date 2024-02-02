export type { MapLayerProps } from './component';
export { MapLayerComp } from './component';


export type { LayerID, MapLayer } from './defs';
export { ROOT_LAYER_ID, GROUP_GENRE_ID } from './defs';


export type {
    GenreID,
    LayerMatch,
    GeoJsonVector,
    OsmTileRaster,
    XyzTileRaster,
    WfsFromCapab,
    WmsFromCapab,
    WmtsFromCapab
} from "./genres";
export {
    LayerGenre,
    GenreRegistry,
    GeoJsonVectorGenre,
    OsmTileRasterGenre,
    XyzTileRasterGenre,
    WfsCapabGenre,
    WmsCapabGenre,
    WmtsCapabGenre
} from "./genres";
