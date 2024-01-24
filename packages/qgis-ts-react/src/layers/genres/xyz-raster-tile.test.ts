import { XyzTileRaster, XyzTileRasterGenre } from "./xyz-raster-tile";
import { LayerGenre, GenreID, LayerMatch } from "./base";
import OlMap from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from "ol/source";
import { Options as TileOptions } from 'ol/layer/BaseTile';
import TileSourceType from 'ol/source/Tile';


describe("XyzTileRasterGenre", () => {
    let xyzTileRasterGenre: XyzTileRasterGenre;
    let map: OlMap;

    beforeEach(() => {
        xyzTileRasterGenre = new XyzTileRasterGenre();
        map = new OlMap();
    });

    it("should have the correct id", () => {
        expect(xyzTileRasterGenre.id).toEqual("xyz-tile-raster");
    });

    xit("should create layers with correct settings", () => {
        const tileOptions: TileOptions<TileSourceType> = { opacity: 0.5 };
        const settings: XyzTileRaster = {
            genre: "xyz-tile-raster",
            tileOptions,
            id: "test",
            url: "https://example.com/tiles/{z}/{x}/{y}.png"
        };
        const match: LayerMatch = {
            settings,
            oldSettings: settings,
            layers: [],
            genre: xyzTileRasterGenre
        };
        xyzTileRasterGenre.createLayers(map, settings);
        const layers = map.getLayers().getArray();
        expect(layers.length).toEqual(1);
        expect(layers[0]).toBeInstanceOf(TileLayer);
        expect(layers[0].getOpacity()).toEqual(tileOptions.opacity);
    });

    xit("should sync layers when settings do not match", () => {
    });

    xit("should not sync layers when settings match", () => {
    });
});
