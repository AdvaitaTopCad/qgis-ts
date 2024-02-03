import OlMap from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { Options as TileOptions } from 'ol/layer/BaseTile';
import XYZ, { Options as XYZOptions } from 'ol/source/XYZ';
import TileSourceType from 'ol/source/Tile';

import { MapLayer } from "../defs";
import { LayerGenre, LayerMatch } from "./base";
import { GenreRegistry } from './registry';
import { Collection } from 'ol';


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

    createLayers(
        map: OlMap,
        collection: Collection<any>,
        props: XyzTileRaster
    ): void {
        const {
            tileOptions,
            ...settings
        } = props;
        const newLayer = new TileLayer({
            source: new XYZ(settings),
            ...tileOptions,
        });
        newLayer.set('settings', props);
        collection.push(newLayer);
    }

    syncLayers(
        map: OlMap, collection: Collection<any>, match: LayerMatch
    ): boolean {
        return this.syncCommonLayers(map, collection, match, []);
    }
}

// Register the genre.
GenreRegistry.i.register(new XyzTileRasterGenre());
