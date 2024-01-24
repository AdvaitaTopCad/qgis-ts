import OlMap from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { Options as TileOptions } from 'ol/layer/BaseTile';
import XYZ, { Options as XYZOptions } from 'ol/source/XYZ';
import TileSourceType from 'ol/source/Tile';

import { MapLayer } from "../defs";
import { LayerGenre, LayerMatch } from "./base";
import { GenreRegistry } from './registry';


/**
 * The settings for an XYZ tile raster layer.
 */
export interface XyzTileRaster extends MapLayer, XYZOptions {
    /**
     * The ID of the genre of this layer.
     */
    genre: "xyz-tile-raster";

    /**
     * The options for the tile layer.
     */
    tileOptions: Omit<TileOptions<TileSourceType>, "source">;
}


/**
 * The XYZ tile raster layer genre.
 *
 * It creates a single layer with the given settings.
 */
export class XyzTileRasterGenre extends LayerGenre {

    get id(): string {
        return 'xyz-tile-raster';
    }

    createLayers(map: OlMap, {
        tileOptions,
        ...settings
    }: XyzTileRaster): void {
        map.getLayers().push(
            new TileLayer({
                source: new XYZ(settings),
                ...tileOptions,
            })
        );
    }

    syncLayers(map: OlMap, match: LayerMatch): void {
        if (!LayerGenre.compareSettings(match)) {
            this.createLayers(map, match.settings as XyzTileRaster);
        }
    }
}

// Register the genre.
GenreRegistry.i.register(new XyzTileRasterGenre());
