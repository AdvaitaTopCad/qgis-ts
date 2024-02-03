import OlMap from 'ol/Map';
import WFSCapabilities from 'ol-wfs-capabilities';
import VectorLayer from 'ol/layer/Vector';
import SourceVector from 'ol/source/Vector';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import OlFormatGML2 from 'ol/format/GML2';
import OlFormatGML3 from 'ol/format/GML3';
import OlFormatGML32 from 'ol/format/GML32';
import OlFormatKML from 'ol/format/KML';
import OlFormatWFS from 'ol/format/WFS';
import FeatureFormat from "ol/format/Feature";
import { bbox as loadingStrategyBBox } from 'ol/loadingstrategy';

import { MapLayer } from "../defs";
import { LayerGenre, LayerMatch } from "./base";
import { GenreRegistry } from './registry';
import { Collection } from 'ol';
import { appendParams } from 'ol/uri';
import { Extent } from 'ol/extent';


// The parser for WFS capabilities.
const parser = new WFSCapabilities();


type WfsVersion = "1.0.0" | "1.1.0" | "2.0.0";
type FormatConstructor = (proj: string, version: WfsVersion) => FeatureFormat;

const formatMap: Record<string, FormatConstructor> = {
    "gml3": (proj: string, version: WfsVersion) => new OlFormatWFS({
        gmlFormat: new OlFormatGML3({ srsName: proj }),
        version
    }),
    "gml32": (proj: string, version: WfsVersion) => new OlFormatWFS({
        gmlFormat: new OlFormatGML32({ srsName: proj }),
        version
    }),
    "application/gml+xml; version=3.2": (
        (proj: string, version: WfsVersion) => new OlFormatWFS({
            gmlFormat: new OlFormatGML32({ srsName: proj }),
            version
        })
    ),

    "gml2": (proj: string, version: WfsVersion) => new OlFormatWFS({
        gmlFormat: new OlFormatGML2({ srsName: proj }),
        version
    }),

    "text/xml; subtype=gml/3.1.1": (
        (proj: string, version: WfsVersion) => new OlFormatWFS({
            gmlFormat: new OlFormatGML3({ srsName: proj }),
            version
        })
    ),
    "text/xml; subtype=gml/3.2": (
        (proj: string, version: WfsVersion) => new OlFormatWFS({
            gmlFormat: new OlFormatGML32({ srsName: proj }),
            version
        })
    ),
    "text/xml; subtype=gml/2.1.2": (
        (proj: string, version: WfsVersion) => new OlFormatWFS({
            gmlFormat: new OlFormatGML2({ srsName: proj }),
            version
        })
    ),

    "kml": (proj: string, version: WfsVersion) => new OlFormatKML({}),
    "application/vnd.google-earth.kml+xml": (
        (proj: string, version: WfsVersion) => new OlFormatKML({})
    ),

    "geojson": (proj: string, version: WfsVersion) => new OlFormatGeoJSON({
        dataProjection: proj
    }),
    "json": (proj: string, version: WfsVersion) => new OlFormatGeoJSON({
        dataProjection: proj
    }),
    "application/json": (
        (proj: string, version: WfsVersion) => new OlFormatGeoJSON({
            dataProjection: proj
        })
    ),
    "application/vnd.geo+json": (
        (proj: string, version: WfsVersion) => new OlFormatGeoJSON({
            dataProjection: proj
        })
    )
};


function constructFormat(
    proj: string, version: WfsVersion, formats: string[]
): [FeatureFormat, string] {
    for (let i = 0, ii = formats.length; i < ii; ++i) {
        const f = formats[i].toLowerCase();
        const constructor = formatMap[f];
        if (constructor) {
            return [constructor(proj, version), f];
        }
    }
    throw new Error(
        `No supported format was found in ${formats}. ` +
        `Available formats are ${Object.keys(formatMap)}.`
    );
}


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
    createLayers(
        map: OlMap,
        collection: Collection<any>,
        props: WfsFromCapab
    ): void {
        const {
            capabUrl,
            layerName,
            ...settings
        } = props;


        fetch(
            appendParams(capabUrl, {
                'SERVICE': 'WFS',
                'REQUEST': 'GetCapabilities',
                'LAYERS': layerName
            }),
        ).then(function (response) {
            return response.text();
        }).then(function (text) {
            // Get the capabilities of the server.
            const result = parser.read(text);
            console.log('[WfsCapabGenre] WFS capabilities:', result);
            const version = (
                result['version'] ||
                result['ServiceIdentification']['ServiceTypeVersion']
            ) as WfsVersion;
            const typeName = version < "2.0.0" ? "typeName" : "typeNames";
            const projection = map.getView().getProjection().getCode();

            const [olFormat, formatName] = constructFormat(
                projection,
                version,
                result['OperationsMetadata']['Operation'].find(
                    (op: any) => op['name'] === 'GetFeature'
                )['Parameter'].find(
                    (p: any) => p['name'] === 'outputFormat'
                )['Value']
            );

            // Create the layer.
            const newLayer = new VectorLayer({
                source: new SourceVector({
                    url: (extent: Extent) => {
                        return appendParams(capabUrl, {
                            'SERVICE': 'WFS',
                            'VERSION': version,
                            'REQUEST': 'GetFeature',
                            [typeName]: layerName,
                            'OUTPUTFORMAT': formatName,
                            'SRSNAME': projection,
                            'BBOX': extent.join(',') + ',' + projection,
                        });
                    },
                    format: olFormat,
                    strategy: loadingStrategyBBox,
                }),
                ...settings
            });
            newLayer.set('settings', props);
            collection.push(newLayer);
        })
    }

    syncLayers(map: OlMap, collection: Collection<any>, match: LayerMatch): boolean {
        return this.syncCommonLayers(map, collection, match, [
            'capabUrl',
            'layerName',
            'extent',
        ]);
    }
}


// Register the genre.
GenreRegistry.i.register(new WfsCapabGenre());
