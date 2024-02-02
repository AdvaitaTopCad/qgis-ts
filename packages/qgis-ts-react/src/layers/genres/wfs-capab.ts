import OlMap from 'ol/Map';
import WFSCapabilities from 'ol-wfs-capabilities';

import { MapLayer } from "../defs";
import { LayerGenre, LayerMatch } from "./base";
import { GenreRegistry } from './registry';


// The parser for WFS capabilities.
const parser = new WFSCapabilities();


/**
 * The settings for a WFS layer initialized from capabilities.
 */
export interface WfsFromCapab extends MapLayer {
    /**
     * The ID of the genre of this layer.
     */
    genre: "wfs-from-capab";

    /**
     * The capabilities url for the WMTS service.
     *
     * The example below is specific to a QGis server using a PostGIS database.
     * @example http://example.com/ows/pg/schema/project?SERVICE=WFS&REQUEST=GetCapabilities
     */
    capabUrl: string;

    /**
     * The name of the layer to use from the capabilities.
     */
    layerName: string;
}


/**
 * A World Feature Service (vector) layer initialized from capabilities url.
 */
export class WfsCapabGenre extends LayerGenre {

    get id(): string {
        return 'wfs-from-capab';
    }
    createLayers(map: OlMap, {
        capabUrl,
        layerName,
        ...settings
    }: WfsFromCapab): void {
        fetch(
            capabUrl
        ).then(function (response) {
            return response.text();
        }).then(function (text) {
            const result = parser.read(text);
            // const options = optionsFromCapabilities(result, {
            //     layer: layerName,
            //     matrixSet: 'EPSG:3857',
            // });
        })
    }

    syncLayers(map: OlMap, match: LayerMatch): void {
        if (!LayerGenre.compareSettings(match)) {
            this.createLayers(map, match.settings as WfsFromCapab);
        }
    }
}


// Register the genre.
GenreRegistry.i.register(new WfsCapabGenre());
