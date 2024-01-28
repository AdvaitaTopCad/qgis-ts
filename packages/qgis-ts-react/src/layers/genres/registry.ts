import OlMap from 'ol/Map';
import { GenreID, LayerGenre, LayerMatch } from "./base";
import { GROUP_GENRE_ID, LayerID, MapLayer } from '../defs';
import BaseLayer from 'ol/layer/Base';
import { Collection } from 'ol';


/**
 * Registry for all layer genres.
 */
export class GenreRegistry {
    private genres: Record<GenreID, LayerGenre> = {};
    private static instance: GenreRegistry;

    /**
     * Returns the singleton instance of the genre registry.
     *
     * @returns The singleton instance of the genre registry.
     */
    static get i(): GenreRegistry {
        if (!GenreRegistry.instance) {
            GenreRegistry.instance = new GenreRegistry();
        }
        return GenreRegistry.instance;
    }

    /**
     * Register a new genre.
     *
     * @param genre The genre to register.
     */
    public register(genre: LayerGenre) {
        this.genres[genre.id] = genre;
    }


    /**
     * Get a genre by its ID.
     *
     * @param id The ID of the genre to get.
     * @throws If no genre with the given ID is registered.
     * @returns The genre with the given ID.
     */
    public getGenre(id: GenreID): LayerGenre {
        if (id === GROUP_GENRE_ID) {
            throw new Error(`The group genre is not registered.`);
        }
        const result = this.genres[id];
        if (!result) {
            throw new Error(`Genre with ID '${id}' is not registered.`);
        }
        return result;
    }

    /**
     * Remove a genre from the registry.
     *
     * @param id The ID of the genre to remove.
     */
    public removeGenre(id: GenreID) {
        delete this.genres[id];
    }

    /**
     * Get all registered genres.
     *
     * @returns All registered genres.
     */
    public getGenres(): Record<GenreID, LayerGenre> {
        return { ...this.genres };
    }

    /**
     * Add, remove and edit layers in the map to match the settings.
     *
     * @param map The map to sync the layers in.
     * @param baseLayer The base layer.
     * @param overlays The overlays.
     */
    public syncLayers(
        map: OlMap,
        baseLayer: MapLayer | undefined,
        overlays: Record<LayerID, MapLayer>
    ) {
        const unknownLayers: BaseLayer[] = [];
        const removedLayers: BaseLayer[] = [];
        const baseMatch: LayerMatch | undefined = baseLayer ? {
            settings: baseLayer,
            oldSettings: baseLayer,
            layers: [],
            genre: this.getGenre(baseLayer.genre)
        } : undefined;
        const overlayMatches: Record<LayerID, LayerMatch> = {};
        const layersCollection: Collection<BaseLayer> = map.getLayers();

        // Go through all layers in the map and match them with the settings.
        layersCollection.forEach((layer) => {
            const layerSettings: (MapLayer | undefined) = layer.get("settings");

            // Save layers that are not registered.
            if (!layerSettings) {
                unknownLayers.push(layer);
                return;
            }

            // Is this part of the base layer?
            if (baseMatch && layerSettings.id === baseLayer!.id) {
                if (baseMatch.layers.length === 0) {
                    baseMatch.oldSettings = layerSettings;
                }
                baseMatch.layers.push(layer);
                return;
            }

            // Is this part of the overlay?
            const overlay = overlays[layerSettings.id];
            if (overlay) {
                // Do we already have a match for this overlay?
                let match = overlayMatches[layerSettings.id];
                if (!match) {
                    // Create a new match.
                    match = {
                        settings: overlay,
                        oldSettings: layerSettings,
                        layers: [layer],
                        genre: this.getGenre(overlay.genre)
                    };
                    overlayMatches[layerSettings.id] = match;
                } else {
                    // Add the layer to the match.
                    match.layers.push(layer);
                }
                return;
            }

            // This layer has been removed.
            removedLayers.push(layer);
        });

        // Remove all layers from the map.
        layersCollection.clear();

        // Add the base layer.
        if (baseMatch) {
            if (baseMatch.layers.length > 0) {
                if (baseMatch.settings === baseMatch.oldSettings) {
                    // The settings have not changed, so we can reuse them.
                    layersCollection.extend(baseMatch.layers);
                } else {
                    // Deffer to the genre to create/update the layers.
                    baseMatch.genre.syncLayers(map, baseMatch);
                }
            } else {
                // We need to create the layers.
                baseMatch.genre.createLayers(map, baseLayer!);
            }
        }

        // Go trough each incoming overlay settings object.
        for (const overlay of Object.values(overlays).reverse()) {
            // Do we already have a match for this overlay?
            let match = overlayMatches[overlay.id];
            if (match) {
                if (match.settings === match.oldSettings) {
                    // The settings have not changed, so we can reuse them.
                    layersCollection.extend(match.layers);
                } else {
                    // Deffer to the genre to create/update the layers.
                    match.genre.syncLayers(map, match);
                }
            } else if (overlay.genre !== GROUP_GENRE_ID) {
                // We need to create the layers.
                this.getGenre(overlay.genre).createLayers(map, overlay);
            }
        }
    }
}
