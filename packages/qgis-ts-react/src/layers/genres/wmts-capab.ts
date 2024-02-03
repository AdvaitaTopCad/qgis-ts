import OlMap from 'ol/Map';
import TileLayer from 'ol/layer/Tile.js';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS.js';
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
import { Options as TileOptions } from 'ol/layer/BaseTile';
import TileSourceType from 'ol/source/Tile';

import { MapLayer } from "../defs";
import { LayerGenre, LayerMatch } from "./base";
import { GenreRegistry } from './registry';
import { Collection } from 'ol';
import { appendParams } from 'ol/uri';


const parser = new WMTSCapabilities();


/**
 * The settings for a WMTS layer initialized from capabilities.
 */
export interface WmtsFromCapab extends MapLayer {
    /**
     * The ID of the genre of this layer.
     */
    genre: "wmts-from-capab";

    /**
     * The capabilities url for the WMTS service.
     *
     * The example below is specific to a QGis server using a PostGIS database.
     * @example http://example.com/ows/pg/schema/project?SERVICE=WMTS&REQUEST=GetCapabilities
     */
    capabUrl: string;

    /**
     * The name of the layer to use from the capabilities.
     */
    layerName: string;

    /**
     * The options for the tile layer.
     */
    tileOptions?: Omit<TileOptions<TileSourceType>, "source">;
}


/**
 * A World Map Tile Service (raster) layer initialized from capabilities url.
 */
export class WmtsCapabGenre extends LayerGenre {

    get id(): string {
        return 'wmts-from-capab';
    }

    createLayers(
        map: OlMap,
        collection: Collection<any>,
        props: WmtsFromCapab
    ): void {
        const {
            capabUrl,
            layerName,
            tileOptions,
        } = props;
        fetch(
            appendParams(capabUrl, {
                'SERVICE': 'WMTS',
                'REQUEST': 'GetCapabilities',
                'LAYERS': layerName
            }),
        ).then(function (response) {
            return response.text();
        }).then(function (text) {
            const result = parser.read(text);
            console.log('[WmtsCapabGenre] Result from server:', result);
            const options = optionsFromCapabilities(result, {
                layer: layerName,
                projection: map.getView().getProjection(),
                matrixSet: 'EPSG:3857',
            });
            if (options) {
                console.log('[WmtsCapabGenre] WMTS options:', options);
                const newLayer = new TileLayer({
                    source: new WMTS({
                        ...options,
                        cacheSize: 1024,
                    }),
                    ...tileOptions,
                });
                newLayer.set('settings', props);
                collection.push(newLayer);
            } else {
                console.error(
                    '[WmtsCapabGenre] No options for WMTS layer ' +
                    'from capabilities.'
                );
            }
        }).catch(function (error) {
            console.error(
                '[WmtsCapabGenre] Error fetching WMTS capabilities:',
                error
            );
        });
    }

    syncLayers(
        map: OlMap, collection: Collection<any>, match: LayerMatch
    ): boolean {
        return this.syncCommonLayers(map, collection, match, []);
    }
}


// Register the genre.
GenreRegistry.i.register(new WmtsCapabGenre());

