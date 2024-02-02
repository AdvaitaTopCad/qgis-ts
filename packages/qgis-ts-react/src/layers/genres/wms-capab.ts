import OlMap from 'ol/Map';
import WMSCapabilities from 'ol/format/WMSCapabilities.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import { Image as ImageLayer } from 'ol/layer.js';

import { MapLayer } from "../defs";
import { LayerGenre, LayerMatch } from "./base";
import { GenreRegistry } from './registry';


const parser = new WMSCapabilities();


const optionsFromCapabilities = (
    capabilities: Record<string, any>,
    { layer }: { layer: string }
) => {
    return {};
}


/**
 * The settings for a WMS layer initialized from capabilities.
 */
export interface WmsFromCapab extends MapLayer {
    /**
     * The ID of the genre of this layer.
     */
    genre: "wms-from-capab";

    /**
     * The capabilities url for the WMTS service.
     *
     * The example below is specific to a QGis server using a PostGIS database.
     * @example http://example.com/ows/pg/schema/project?SERVICE=WMS&REQUEST=GetCapabilities
     */
    capabUrl: string;

    /**
     * The name of the layer to use from the capabilities.
     */
    layerName: string;
}


/**
 * A World Map Service (raster) layer initialized from capabilities url.
 */
export class WmsCapabGenre extends LayerGenre {

    get id(): string {
        return 'wms-from-capab';
    }
    createLayers(map: OlMap, {
        capabUrl,
        layerName,
        ...settings
    }: WmsFromCapab): void {
        fetch(
            capabUrl
        ).then(function (response) {
            return response.text();
        }).then(function (text) {
            const result = parser.read(text);
            const options = optionsFromCapabilities(result, {
                layer: layerName,
            });
            if (options) {
                map.getLayers().push(
                    new ImageLayer({
                        extent: [-13884991, 2870341, -7455066, 6338219],
                        source: new ImageWMS({
                            url: 'http://127.0.0.1:8001/ogc/example-2?SERVICE=WMS',
                            params: { 'LAYERS': layerName },
                            ratio: 1,
                            serverType: 'qgis',
                        }),
                    }),
                );
            } else {
                console.error('No options for WMTS layer from capabilities.');
            }
        }).catch(function (error) {
            console.error('Error fetching WMTS capabilities:', error);
        });

    }

    syncLayers(map: OlMap, match: LayerMatch): void {
        if (!LayerGenre.compareSettings(match)) {
            this.createLayers(map, match.settings as WmsFromCapab);
        }
    }
}


// Register the genre.
GenreRegistry.i.register(new WmsCapabGenre());
