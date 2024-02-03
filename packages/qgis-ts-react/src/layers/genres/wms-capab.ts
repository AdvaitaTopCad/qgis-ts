import OlMap from 'ol/Map';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import ImageWMS from 'ol/source/ImageWMS';
import { Image as ImageLayer, Layer } from 'ol/layer';
import { appendParams } from 'ol/uri';
import { get as getProjection, getTransform } from 'ol/proj';

import { MapLayer } from "../defs";
import { LayerGenre, LayerMatch } from "./base";
import { GenreRegistry } from './registry';
import { Extent, applyTransform } from 'ol/extent';
import { Collection } from 'ol';


const parser = new WMSCapabilities();


/**
 * The settings for a WMS layer initialized from capabilities.
 */
export interface WmsFromCapab extends MapLayer {
    /**
     * The ID of the genre of this layer.
     */
    genre: "wms-from-capab" | "wms-tile-capab";

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
    createLayers(
        map: OlMap,
        collection: Collection<any>,
        props: WmsFromCapab
    ): void {
        const self = this;
        const {
            capabUrl,
            layerName,
            ...settings
        } = props;
        console.log('[WmsCapabGenre] WMS settings:', settings);
        fetch(
            appendParams(capabUrl, {
                'SERVICE': 'WMS',
                'REQUEST': 'GetCapabilities',
                'LAYERS': layerName
            }),
        ).then(function (response) {
            return response.text();
        }).then(function (text) {
            // Get the capabilities of the server.
            const result = parser.read(text);
            console.log('[WmsCapabGenre] WMS capabilities:', result);

            // Find the layer in the capabilities.
            const layerCapab = result.Capability.Layer.Layer.find(
                (l: any) => l.Name === layerName
            );
            if (!layerCapab) {
                console.error('Layer not found in capabilities:', layerName);
                return;
            }
            console.log('[WmsCapabGenre] layerCapab:', layerCapab);

            // Convert the extent to the correct projection.
            const mapProj = map.getView().getProjection();
            console.log('[WmsCapabGenre] mapProj:', mapProj);
            let extent = layerCapab.BoundingBox.filter(
                (bb: any) => (
                    bb.crs === mapProj.getCode() ||
                    bb.srs === mapProj.getCode()
                )
            );
            if (extent.length == 0) {
                extent = layerCapab.BoundingBox[0].extent;
                console.log('[WmsCapabGenre] Original extent:', mapProj);
                let extentProj = getProjection(
                    layerCapab.BoundingBox[0].crs ||
                    layerCapab.BoundingBox[0].srs
                );
                console.log("[WmsCapabGenre] extentProj %O", extentProj);
                if (!extentProj) {
                    console.error('[WmsCapabGenre] No extent projection:', extentProj);
                    extentProj = mapProj;
                } else {
                    if (extentProj.getAxisOrientation().startsWith('ne')) {
                        extent = [extent[1], extent[0], extent[3], extent[2]];
                    }
                }
                console.log('[WmsCapabGenre] extent before transform:', extent);
                const transf = getTransform(extentProj, mapProj);
                extent = applyTransform(
                    extent, transf, undefined, 8
                );
            } else {
                extent = extent[0].extent;
            }
            console.log('[WmsCapabGenre] extent:', extent);

            const newLayer = self.wmsCreateLayer(map, extent, props);
            newLayer.set('settings', props);
            collection.push(newLayer);
        }).catch(function (error) {
            console.error('Error fetching WMTS capabilities:', error);
        });
    }

    wmsCreateLayer(
        map: OlMap,
        extent: Extent,
        props: WmsFromCapab
    ): Layer {
        const {
            capabUrl,
            layerName,
            ...settings
        } = props;
        return new ImageLayer({
            extent,
            source: new ImageWMS({
                url: capabUrl,
                ratio: 1,
                serverType: 'qgis',
                params: {
                    'LAYERS': layerName,
                },
            }),
            ...settings,
        });
    }

    syncLayers(
        map: OlMap,
        collection: Collection<any>,
        match: LayerMatch
    ): boolean {
        return this.syncCommonLayers(map, collection, match, [
            'capabUrl',
            'layerName',
            'extent',
        ]);
    }
}


// Register the genre.
GenreRegistry.i.register(new WmsCapabGenre());
