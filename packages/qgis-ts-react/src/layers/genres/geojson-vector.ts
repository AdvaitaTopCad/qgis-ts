import OlMap from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource, { Options as VectorSourceOptions } from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';

import { MapLayer } from "../defs";
import { LayerGenre, LayerMatch } from "./base";
import { GenreRegistry } from './registry';
import { Collection } from 'ol';


/**
 * The settings for a GeoJSON layer.
 */
export interface GeoJsonVector
    extends MapLayer, Omit<VectorSourceOptions, "format"> {

    /**
     * The ID of the genre of this layer.
     */
    genre: "geojson-vector";

    /**
     * The options for the vector layer.
     */
    vectorOptions: Omit<VectorLayer<VectorSource>, "source">;
}


/**
 * The GeoJSON layer genre.
 *
 * It creates a single layer with the given settings.
 */
export class GeoJsonVectorGenre extends LayerGenre {

    get id(): string {
        return 'geojson-vector';
    }

    createLayers(
        map: OlMap,
        collection: Collection<any>,
        props: GeoJsonVector
    ): void {
        const {
            vectorOptions,
            // Omitted
            genre,
            parent,
            title,
            id,
            // General layer settings
            opacity,
            visible,
            extent,
            zIndex,
            minResolution,
            maxResolution,
            minZoom,
            maxZoom,
            background,
            // The rest are for the source.
            ...settings
        } = props;
        const newLayer = new VectorLayer({
            source: new VectorSource({
                // TODO: If performance is the primary concern, and
                // features are not going to be modified or
                // round-tripped through the format, consider using
                // {@link module:ol/render/Feature~RenderFeature}
                format: new GeoJSON(),
                ...settings,
            }),
            opacity,
            visible,
            extent,
            zIndex,
            minResolution,
            maxResolution,
            minZoom,
            maxZoom,
            background,
            ...vectorOptions,
        });
        newLayer.set('settings', props);
        collection.push(newLayer);
        console.log("[GeoJsonVectorGenre] createLayers %O", newLayer);
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
GenreRegistry.i.register(new GeoJsonVectorGenre());
