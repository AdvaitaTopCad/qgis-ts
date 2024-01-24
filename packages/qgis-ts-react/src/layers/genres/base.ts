import OlMap from 'ol/Map';
import BaseLayer from "ol/layer/Base";
import { MapLayer } from "../defs";

/**
 * The unique identifier of a layer genre.
 */
export type GenreID = string;


/**
 * A match between a layer in the map and the settings that generated it.
 */
export interface LayerMatch {
    /**
     * The settings that generated the layers.
     */
    settings: MapLayer;

    /**
     * The settings saved along with the (first) layer.
     */
    oldSettings: MapLayer;

    /**
     * The list of layers in the map that were generated from the settings.
     */
    layers: BaseLayer[];

    /**
     * The genre of the layer.
     */
    genre: LayerGenre;
}


/**
 * Base class for all layer genres.
 */
export abstract class LayerGenre {

    /**
     * The unique identifier of this genre.
     */
    abstract get id(): GenreID;

    /**
     * Create layers from the given settings.
     *
     * @param map The map to create the layers for.
     * @param settings The settings to create the layers from.
     */
    abstract createLayers(map: OlMap, settings: MapLayer): void;

    /**
     * Update the layers generated from the given settings.
     *
     * The default implementation ignores old layers and calls `createLayers`.
     *
     * @param map The map to update the layers for.
     * @param match The match between the settings and the layers.
     */
    syncLayers(map: OlMap, match: LayerMatch): void {
        this.createLayers(map, match.settings);
    }

    /**
     * Helper for syncLayers that checks each settings property for changes.
     *
     * @param match The match between the settings and the layers.
     *
     * @returns True if the settings are the same, false otherwise.
     */
    protected static compareSettings(match: LayerMatch): boolean {
        if (
            Object.keys(match.settings).length !==
            Object.keys(match.oldSettings).length
        ) {
            return false;
        }
        for (const [key, value] of Object.entries(match.settings)) {
            if (value !== (match.oldSettings as any)[key]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Helper for syncLayers that returns an array of properties that changed.
     *
     * @param match The match between the settings and the layers.
     *
     * @returns The list of properties that changed.
     */
    protected static changedProperties(match: LayerMatch): string[] {
        const changed = new Set<string>();
        for (const [key, value] of Object.entries(match.settings)) {
            if (value !== (match.oldSettings as any)[key]) {
                changed.add(key);
            }
        }
        for (const [key, value] of Object.entries(match.oldSettings)) {
            if (value !== (match.settings as any)[key]) {
                changed.add(key);
            }
        }
        return Array.from(changed);
    }
}
