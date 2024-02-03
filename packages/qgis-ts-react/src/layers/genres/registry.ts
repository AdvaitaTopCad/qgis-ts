import OlMap from 'ol/Map';
import { GenreID, LayerGenre, LayerMatch } from "./base";
import { GROUP_GENRE_ID, LayerID, MapLayer } from '../defs';
import BaseLayer from 'ol/layer/Base';
import { Collection } from 'ol';
import { Layer } from 'ol/layer';


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
     * @param baseLayer The current base layer.
     * @param overlays The flat list of overlays.
     */
    public syncLayers(
        map: OlMap,
        baseLayer: MapLayer | undefined,
        overlays: Record<LayerID, MapLayer>
    ) {
        // Has a match only if
        const baseMatch: LayerMatch | undefined = baseLayer ? {
            settings: baseLayer,
            oldSettings: baseLayer,
            layers: [],
            genre: this.getGenre(baseLayer.genre)
        } : undefined;

        const unknownLayers: BaseLayer[] = [];
        const removedLayers: BaseLayer[] = [];
        const overlayMatches: Record<LayerID, LayerMatch> = {};
        const layersCollection: Collection<BaseLayer> = map.getLayers();
        const newCollection = new Collection<any>([], { unique: true });
        let needsRecreate: boolean = false;

        // Go through all layers in the map and match them with the
        // new settings.
        layersCollection.forEach((layer) => {
            const layerSettings: (MapLayer | undefined) = layer.get("settings");

            // Save layers that do not have our flavour of settings.
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

        // console.log('[GenreRegistry] unknownLayers:', unknownLayers);
        // console.log('[GenreRegistry] removedLayers:', removedLayers);
        // console.log('[GenreRegistry] baseMatch:', baseMatch);
        // console.log('[GenreRegistry] overlayMatches:', overlayMatches);


        // Add the base layer.
        if (baseMatch) {
            if (baseMatch.layers.length > 0) {
                if (baseMatch.settings === baseMatch.oldSettings) {
                    // The settings have not changed, so we can reuse them.
                    newCollection.extend(baseMatch.layers);
                    // console.log(
                    //     '[GenreRegistry] no change in :', baseMatch.settings.id
                    // );
                } else {
                    // Deffer to the genre to create/update the layers.
                    needsRecreate = baseMatch.genre.syncLayers(
                        map, newCollection, baseMatch
                    ) || needsRecreate;
                    // console.log(
                    //     '[GenreRegistry] recreate after base %s is %O:',
                    //     baseMatch.settings.id, needsRecreate
                    // );
                }
            } else {
                // We need to create the layers.
                baseMatch.genre.createLayers(map, newCollection, baseLayer!);
                needsRecreate = true;
                // console.log(
                //     '[GenreRegistry] create new base layer %s:', baseLayer!.id
                // );
            }
        }

        // Go trough each incoming overlay settings object.
        for (const overlay of Object.values(overlays).reverse()) {
            // Do we already have a match for this overlay?
            let match = overlayMatches[overlay.id];
            if (match) {
                // console.log('[GenreRegistry] Overlay mMatch:', match);
                if (match.settings === match.oldSettings) {
                    // The settings have not changed, so we can reuse them.
                    newCollection.extend(match.layers);
                    // console.log(
                    //     '[GenreRegistry] no change in :', match.settings.id
                    // );
                } else {
                    // Deffer to the genre to create/update the layers.
                    needsRecreate = match.genre.syncLayers(
                        map, newCollection, match
                    ) || needsRecreate;
                    // console.log(
                    //     '[GenreRegistry] recreate after overlay %s is %O:',
                    //     match.settings.id, needsRecreate
                    // );
                }
            } else if (overlay.genre !== GROUP_GENRE_ID) {
                // We need to create the layers.
                this.getGenre(overlay.genre).createLayers(
                    map, newCollection, overlay
                );
                needsRecreate = true;
                // console.log(
                //     '[GenreRegistry] create new overlay %s:', overlay.id
                // );
            }
        }

        if (needsRecreate) {
            map.setLayers(newCollection);
            // console.log('[GenreRegistry] Layers recreated.');
        } else {
            removedLayers.forEach((layer) => {
                layersCollection.remove(layer);
            });
            // console.log(
            //     '[GenreRegistry] Layers NOT recreated (%d removed).',
            //     removedLayers.length
            // );
        }
    }
}
