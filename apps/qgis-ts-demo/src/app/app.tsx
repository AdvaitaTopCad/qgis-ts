import { IntlProvider } from 'react-intl';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QgisStandardApp } from '@qgis-ts/ui-emotion';
import 'ol/ol.css';
import { GeoJsonVector, MapLayerComp, WmsFromCapab, WmtsFromCapab } from '@qgis-ts/react';
import { ProjectionLike, get as getProjection, } from 'ol/proj';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';


proj4.defs('EPSG:3844',
    '+proj=sterea +lat_0=46 +lon_0=25 +k=0.99975 ' +
    '+x_0=500000 +y_0=500000 +ellps=krass ' +
    '+towgs84=2.329,-147.042,-92.08,0.309,-0.325,-0.497,5.69 ' +
    '+units=m +no_defs +type=crs');
register(proj4);

export const projection: ProjectionLike = getProjection('EPSG:3844')!;
console.log("[StartUp] Stereo 70 projection", projection);


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


export function App() {
    return (
        <IntlProvider locale="en">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <QgisStandardApp
                    initialView={{
                        center: [
                            2456018,
                            5754799
                        ],
                        zoom: 7,
                    }}
                >
                    <MapLayerComp>
                        <MapLayerComp
                            layerKind="base"
                            activate
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
                            <MapLayerComp<GeoJsonVector>
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
                            />
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
                                        title: 'Group2.1.1',
                                        genre: 'group',
                                    }}
                                >

                                </MapLayerComp>
                                <MapLayerComp
                                    layerKind="group"
                                    settings={{
                                        id: 'group2.1.2',
                                        title: 'Group2.1.2',
                                        genre: 'group',
                                    }}
                                >
                                <MapLayerComp<WmsFromCapab>
                                    layerKind="overlay"
                                    settings={{
                                        id: 'wms-from-capab',
                                        title: 'WMS from Capabilities',
                                        genre: 'wms-from-capab',
                                        capabUrl: 'http://127.0.0.1:8001/ogc/example-2?SERVICE=WMS&REQUEST=GetCapabilities',
                                        layerName: "ZZZZZZ1"
                                    }}
                                />
                                </MapLayerComp>
                            </MapLayerComp>
                            <MapLayerComp
                                layerKind="group"
                                settings={{
                                    id: 'group2.2',
                                    title: 'Group2.2',
                                    genre: 'group',
                                }}
                            >
                                <MapLayerComp<WmtsFromCapab>
                                    layerKind="overlay"
                                    settings={{
                                        id: 'some-tiles',
                                        title: 'Tiles from Capabilities',
                                        genre: 'wmts-from-capab',
                                        capabUrl: 'http://127.0.0.1:8001/ogc/example-2?SERVICE=WMTS&REQUEST=GetCapabilities',
                                        layerName: "TTTTTT3"
                                    }}
                                />
                            </MapLayerComp>
                        </MapLayerComp>
                    </MapLayerComp>
                </QgisStandardApp>
            </ThemeProvider>
        </IntlProvider>
    );
}

export default App;
