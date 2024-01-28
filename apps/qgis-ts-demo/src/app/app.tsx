import { IntlProvider } from 'react-intl';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QgisStandardApp } from '@qgis-ts/ui-emotion';
import 'ol/ol.css';
import { GeoJsonVector, MapLayerComp } from '@qgis-ts/react';


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
                        center: [0, 0],
                        zoom: 2,
                    }}
                >
                    <MapLayerComp>
                        {/* <MapLayerComp
                            layerKind="base"
                            activate
                            settings={{
                                id: "osm",
                                genre: 'osm-tile-raster',
                                title: 'OpenStreetMap',
                            }}
                        /> */}
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

                            </MapLayerComp>
                        </MapLayerComp>
                    </MapLayerComp>
                </QgisStandardApp>
            </ThemeProvider>
        </IntlProvider>
    );
}

export default App;
