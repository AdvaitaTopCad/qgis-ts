import OlMap from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { Options as TileOptions } from 'ol/layer/BaseTile';
import OSM, { Options as OsmOptions } from 'ol/source/OSM';
import TileSourceType from 'ol/source/Tile';
import { MapLayer } from "../defs";
import { LayerGenre, LayerMatch } from "./base";
import { GenreRegistry } from './registry';
import { Collection } from 'ol';


/**
 * The settings for an OSM tile raster layer.
 */
export interface OsmTileRaster extends MapLayer, OsmOptions {
    /**
     * The ID of the genre of this layer.
     */
    genre: "osm-tile-raster";

    /**
     * The options for the tile layer.
     */
    tileOptions: Omit<TileOptions<TileSourceType>, "source">;
}


/**
 * The OSM tile raster layer genre.
 *
 * It creates a single layer with the given settings.
 */
export class OsmTileRasterGenre extends LayerGenre {

    get id(): string {
        return 'osm-tile-raster';
    }

    createLayers(
        map: OlMap,
        collection: Collection<any>,
        props: OsmTileRaster
    ): void {
        const {
            tileOptions,
            ...settings
        } = props;

        const newLayer = new TileLayer({
            source: new OSM(settings),
            ...tileOptions,
        });
        newLayer.set('settings', props);
        collection.push(newLayer);
    }

    syncLayers(
        map: OlMap,
        collection: Collection<any>,
        match: LayerMatch
    ): boolean {
        return this.syncCommonLayers(map, collection, match, []);
    }
}

// Register the genre.
GenreRegistry.i.register(new OsmTileRasterGenre());
