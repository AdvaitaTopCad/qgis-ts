import OlMap from 'ol/Map';
import { Extent } from "ol/extent";
import { WmsCapabGenre, WmsFromCapab } from "./wms-capab";
import { Layer } from "ol/layer";
import OlLayerTile from 'ol/layer/Tile';
import OlSourceTileWMS from 'ol/source/TileWMS';
import { GenreRegistry } from './registry';


/**
 * A World Map Service (raster) layer initialized from capabilities url
 * that splits requests into tiles.
 */
export class WmsTileCapabGenre extends WmsCapabGenre {

    get id(): string {
        return 'wms-tile-capab';
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
        // const tileGrid = new OlTileGridTileGrid({
        //     extent,
        //     tileSize: 512,
        //     // maxZoom: resolutions.length,
        //     resolutions: map.getView().getResolutions() || []
        // })
        // console.log('[WmsTileCapabGenre] tileGrid %O', tileGrid)
        return new OlLayerTile({
            extent,
            source: new OlSourceTileWMS({
                url: capabUrl,
                serverType: 'qgis',
                params: {
                    'LAYERS': layerName,
                    'TILED': true,
                },
                cacheSize: 1024,
                // tileGrid,
            }),
            // source: new TileDebug({
            //     // tileGrid,
            //     template: 'z:{z} x:{x} y:{-y}',
            // }),
            ...settings,
        })
    }
}


// Register the genre.
GenreRegistry.i.register(new WmsTileCapabGenre());
