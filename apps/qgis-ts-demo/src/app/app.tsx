import { IntlProvider } from 'react-intl';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QgisStandardApp } from '@qgis-ts/ui-emotion';
import 'ol/ol.css';
import { GeoJsonVector, MapLayerComp, WfsFromCapab, WmsFromCapab, WmtsFromCapab } from '@qgis-ts/react';
import { Projection, ProjectionLike, addProjection, get as getProjection, } from 'ol/proj';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';





const theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    height: "100vh",
                    width: "100vw",
                    padding: "0px !important",
                    margin: "0px !important",
                    overflow: "hidden",
                },
                html: {
                    boxSizing: "border-box",
                }
            }
        }
    }
});

if (!getProjection("EPSG:4326")) {
    throw new Error("WGS84 projection not found");
}

if (!getProjection("EPSG:3857")) {
    throw new Error("EPSG:3857 projection not found");
}


/**
 * EPSG:3844 projection is a `neu` projection. That information is available in
 * `OGC WKT 2` section of the https://epsg.io/3844 page but not in the
 * `PROJ.4` section (possibly due to the fact that `PROJ.4` is not capable of
 * representing `neu` projections).
 *
 * OTOH proj4 library only supports `ESRI WKT` spec which also does not
 * include this information.
 *
 * By looking at the `register` source code I came up with following
 * implementation which:
 * - registers the proj4 definition using `ESRI WKT`
 * - gets the constructed object
 * - creates the Projection instance
 * - adds the projection to the ol library
 * - call register to compute transform functions
 *
 * The axis is important because QGis uses the extended version and reports
 * the extent in the `neu` axis order.
 */
function defineEpsg3844() {
    // PROJ.4 definition:
    //
    // '+proj=sterea +lat_0=46 +lon_0=25 +k=0.99975 ' +
    // '+x_0=500000 +y_0=500000 +ellps=krass ' +
    // '+towgs84=2.329,-147.042,-92.08,0.309,-0.325,-0.497,5.69 ' +
    // '+units=m +no_defs +type=crs'

    // OGC WKT 2 definition:
    //
    //     `PROJCRS["Pulkovo 1942(58) / Stereo70",
    //     BASEGEOGCRS["Pulkovo 1942(58)",
    //         DATUM["Pulkovo 1942(58)",
    //             ELLIPSOID["Krassowsky 1940",6378245,298.3,
    //                 LENGTHUNIT["metre",1]]],
    //         PRIMEM["Greenwich",0,
    //             ANGLEUNIT["degree",0.0174532925199433]],
    //         ID["EPSG",4179]],
    //     CONVERSION["Stereo 70",
    //         METHOD["Oblique Stereographic",
    //             ID["EPSG",9809]],
    //         PARAMETER["Latitude of natural origin",46,
    //             ANGLEUNIT["degree",0.0174532925199433],
    //             ID["EPSG",8801]],
    //         PARAMETER["Longitude of natural origin",25,
    //             ANGLEUNIT["degree",0.0174532925199433],
    //             ID["EPSG",8802]],
    //         PARAMETER["Scale factor at natural origin",0.99975,
    //             SCALEUNIT["unity",1],
    //             ID["EPSG",8805]],
    //         PARAMETER["False easting",500000,
    //             LENGTHUNIT["metre",1],
    //             ID["EPSG",8806]],
    //         PARAMETER["False northing",500000,
    //             LENGTHUNIT["metre",1],
    //             ID["EPSG",8807]]],
    //     CS[Cartesian,2],
    //         AXIS["northing (X)",north,
    //             ORDER[1],
    //             LENGTHUNIT["metre",1]],
    //         AXIS["easting (Y)",east,
    //             ORDER[2],
    //             LENGTHUNIT["metre",1]],
    //     USAGE[
    //         SCOPE["Engineering survey, topographic mapping."],
    //         AREA["Romania - onshore and offshore."],
    //         BBOX[43.44,20.26,48.27,31.41]],
    //     ID["EPSG",3844]]

    const epsg3844Wkt = (
        `PROJCS["Pulkovo_1942_Adj_58_Stereo_70",
            GEOGCS["GCS_Pulkovo_1942_Adj_1958",
                DATUM["D_Pulkovo_1942_Adj_1958",
                    SPHEROID["Krasovsky_1940",6378245.0,298.3]],
                PRIMEM["Greenwich",0.0],
                UNIT["Degree",0.0174532925199433]],
            PROJECTION["Double_Stereographic"],
            PARAMETER["False_Easting",500000.0],
            PARAMETER["False_Northing",500000.0],
            PARAMETER["Central_Meridian",25.0],
            PARAMETER["Scale_Factor",0.99975],
            PARAMETER["Latitude_Of_Origin",46.0],
            UNIT["Meter",1.0]]`.replace(/\s+/g, " ")
    );
    proj4.defs("EPSG:3844", epsg3844Wkt);
    const def = proj4.defs("EPSG:3844");
    console.log("[defineEpsg3844] proj4 def: %O", def);
    console.log("[defineEpsg3844] axis def: %O", def.axis);
    const epsg3844Proj = new Projection({
        code: "EPSG:3844",
        axisOrientation: 'neu',
        metersPerUnit: def.to_meter,
        units: "m",
        extent: [215561.44, 116424.61, 771863.53, 1018946.51],
    });
    addProjection(epsg3844Proj);
    register(proj4);
    return epsg3844Proj;
}


const initialProjections = {
    "EPSG:4326": getProjection("EPSG:4326")!,
    "EPSG:3857": getProjection("EPSG:3857")!,
    "EPSG:3844": defineEpsg3844(),
}


export function App() {
    return (
        <IntlProvider locale="en">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <QgisStandardApp
                    initialView={{
                        center: [2859600.9089033543, 5717081.23602427],
                        zoom: 14,
                    }}
                    initialProjections={initialProjections}
                    initialProjection="EPSG:4326"
                >
                    <MapLayerComp>
                        <MapLayerComp
                            layerKind="base"
                            activate={false}
                            settings={{
                                id: "osm",
                                genre: 'osm-tile-raster',
                                title: 'OpenStreetMap',
                            }}
                        />
                        <MapLayerComp
                            layerKind="group"
                            settings={{
                                id: 'group',
                                title: 'Group',
                                genre: 'group',
                            }}
                        >
                            {/* <MapLayerComp<GeoJsonVector>
                                layerKind="overlay"
                                activate
                                settings={{
                                    id: 'eco-regions',
                                    title: 'Eco-regions',
                                    genre: 'geojson-vector',
                                    vectorOptions: {
                                        background: '#1a2b39a0',
                                        style: {
                                            'fill-color': [
                                                'string', ['get', 'COLOR'], '#eee'
                                            ],
                                        },
                                    } as any,
                                    url: 'https://openlayers.org/data/vector/ecoregions.json',
                                    //  url: 'https://example.com/geojson',
                                }}
                            /> */}
                        </MapLayerComp>
                        <MapLayerComp
                            layerKind="group"
                            settings={{
                                id: 'group2',
                                title: 'Group2',
                                genre: 'group',
                            }}
                        >
                            <MapLayerComp
                                layerKind="group"
                                settings={{
                                    id: 'group2.1',
                                    title: 'Group2.1',
                                    genre: 'group',
                                }}
                            >
                                <MapLayerComp
                                    layerKind="group"
                                    settings={{
                                        id: 'group2.1.1',
                                        title: 'WFS',
                                        genre: 'group',
                                    }}
                                >
                                    <MapLayerComp<WfsFromCapab>
                                        layerKind="overlay"
                                        settings={{
                                            id: 'wmf-from-capab-1',
                                            title: 'WFS from Capabilities',
                                            genre: 'wfs-from-capab',
                                            capabUrl: 'http://127.0.0.1:8001/ogc/example-2',
                                            layerName: "some-polygons",
                                            visible: true,
                                        }}
                                    />
                                </MapLayerComp>
                                <MapLayerComp
                                    layerKind="group"
                                    settings={{
                                        id: 'group2.1.2',
                                        title: 'WMS',
                                        genre: 'group',
                                    }}
                                >
                                    {/* <MapLayerComp<WmsFromCapab>
                                        layerKind="overlay"
                                        settings={{
                                            id: 'wms-from-capab-1',
                                            title: 'WMS from Capabilities',
                                            genre: 'wms-from-capab',
                                            capabUrl: 'http://127.0.0.1:8001/ogc/example-2',
                                            layerName: "ZZZZZZ1",
                                            visible: false,
                                        }}
                                    />
                                    <MapLayerComp<WmsFromCapab>
                                        layerKind="overlay"
                                        settings={{
                                            id: 'wms-from-capab-2',
                                            title: 'Whole Project',
                                            genre: 'wms-tile-capab',
                                            capabUrl: 'http://127.0.0.1:8001/ogc/example-2',
                                            layerName: "tyu",
                                            visible: false,
                                        }}
                                    /> */}
                                </MapLayerComp>
                            </MapLayerComp>
                            <MapLayerComp
                                layerKind="group"
                                settings={{
                                    id: 'group2.2',
                                    title: 'WMTS',
                                    genre: 'group',
                                }}
                            >
                                <MapLayerComp<WmtsFromCapab>
                                    layerKind="overlay"
                                    settings={{
                                        id: 'some-tiles-1',
                                        title: 'Tiles from Capabilities',
                                        genre: 'wmts-from-capab',
                                        capabUrl: 'http://127.0.0.1:8001/ogc/example-2',
                                        layerName: "ZZZZZZ1",
                                        // visible: false,
                                    }}
                                />
                                {/* <MapLayerComp<WmtsFromCapab>
                                    layerKind="overlay"
                                    settings={{
                                        id: 'some-tiles-2',
                                        title: 'Whole Project',
                                        genre: 'wmts-from-capab',
                                        capabUrl: 'http://127.0.0.1:8001/ogc/example-2',
                                        layerName: "tyu",
                                        visible: false,
                                    }}
                                /> */}
                            </MapLayerComp>
                        </MapLayerComp>
                    </MapLayerComp>
                </QgisStandardApp>
            </ThemeProvider>
        </IntlProvider>
    );
}

export default App;
