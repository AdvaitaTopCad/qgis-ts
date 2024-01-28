import OlMap from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource, { Options as VectorSourceOptions } from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';

import { MapLayer } from "../defs";
import { LayerGenre, LayerMatch } from "./base";
import { GenreRegistry } from './registry';


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

    createLayers(map: OlMap, {
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
    }: GeoJsonVector): void {
        const newLayer =new VectorLayer({
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

        map.getLayers().push(newLayer);
        console.log("[GeoJsonVectorGenre] createLayers %O", newLayer);
    }

    syncLayers(map: OlMap, match: LayerMatch): void {
        if (!LayerGenre.compareSettings(match)) {
            this.createLayers(map, match.settings as GeoJsonVector);
        }
    }
}

// Register the genre.
GenreRegistry.i.register(new GeoJsonVectorGenre());
