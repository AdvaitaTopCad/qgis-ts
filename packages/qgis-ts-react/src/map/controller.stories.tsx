import { FC, useCallback, useState } from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Box, Button } from '@mui/material';
import type { QgisMapControllerProps } from './controller';
import { QgisMapController } from './controller';
import { MapDebugger } from '@qgis-ts/debug';
import { IntlProvider } from 'react-intl';

import { useQgisMapContext } from './general-context';
import "../layers/genres/xyz-raster-tile";
import "../layers/genres/osm-raster-tile";
import "../layers/genres/geojson-vector";
import { useQgisMapLayersContext } from './layers-context';
import { useQgisMapViewContext } from './view-context';


// The properties passed to each story.
type StoryProps = QgisMapControllerProps;


// Common configuration for all stories.
const storybookConfig: Meta<StoryProps> = {
    title: 'react/controller',
    tags: [],
    component: QgisMapController,
    args: {

    },
};
export default storybookConfig;

const mapStyle = {
    width: '100%',
    height: '256px',
    backgroundColor: 'red'
}

const baseLayerSettings = (i: number) => {
    const md = i % 3;
    switch (md) {
        case 0:
            return {
                genre: 'osm-tile-raster',
                attributions:
                    'All maps © <a href="https://www.openseamap.org/">' +
                    'OpenSeaMap</a>',
                url:
                    'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
            };
        case 1:
            return {
                genre: 'osm-tile-raster',
            };
        case 2:
            return {
                genre: 'xyz-tile-raster',
                attributions:
                    'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                    'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
                url:
                    'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                    'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            }
    }
    throw new Error("Invalid mode");
}

const overlayLayerSettings = (i: number) => {
    return {
        genre: 'geojson-vector',
        vectorOptions: {
            background: '#1a2b39a0',
            style: {
                'fill-color': ['string', ['get', 'COLOR'], '#eee'],
            },
        },
        url: 'https://openlayers.org/data/vector/ecoregions.json',
    };
}

const Inner: FC = () => {
    console.log("[Inner] render");
    const {
        addBaseLayer,
        removeBaseLayer,
        editBaseLayer,
        setActiveBaseLayer,
        addOverlayLayer,
        removeOverlayLayer,
        setActiveOverlayLayer,
        editOverlayLayer,
    } = useQgisMapContext();
    const {
        mapId,
        mapRef,
    } = useQgisMapViewContext();
    const {
        bases,
        activeBase,
        overlays,
        activeOverlay,
    } = useQgisMapLayersContext();

    const [baseCounter, setBaseCounter] = useState(1);
    const [toDeleteBase, setToDeleteBase] = useState(false);
    const [toDeleteOverlay, setToDeleteOverlay] = useState(false);
    const [overlayCounter, setOverlayCounter] = useState(1);

    return (
        <Box>
            <Box>
                <Box display="flex" flexWrap="wrap">
                    <Button
                        onClick={useCallback(() => {
                            if (!toDeleteBase) {
                                setToDeleteBase(true);
                                addBaseLayer({
                                    id: 'toDeleteBase',
                                    title: 'toDeleteBase',
                                    ...baseLayerSettings(0),
                                });
                                return;
                            } else {
                                addBaseLayer({
                                    id: 'base' + baseCounter,
                                    title: 'base' + baseCounter,
                                    ...baseLayerSettings(baseCounter),
                                });
                                setBaseCounter(baseCounter + 1);
                            }
                        }, [baseCounter, toDeleteBase])}
                        variant='contained'
                        size="small"
                    >
                        Add Base Layer
                    </Button>
                    <Button
                        onClick={useCallback(() => {
                            if (activeBase) {
                                let crtId = parseInt(
                                    activeBase.replace('base', '')
                                );
                                crtId = crtId + 1;
                                if (crtId >= baseCounter) {
                                    crtId = 1;
                                }
                                setActiveBaseLayer(`base${crtId}`);
                            } else {
                                setActiveBaseLayer('base1');
                            }
                        }, [baseCounter, activeBase, bases])}
                        disabled={
                            Object.keys(bases).length === 0 ||
                            baseCounter === 1
                        }
                        size="small"
                    >
                        Set Current
                    </Button>
                    <Button
                        onClick={useCallback(() => {
                            editBaseLayer(
                                {
                                    id: 'base1',
                                    title: 'base1',
                                    ...baseLayerSettings(overlayCounter),
                                },
                                true
                            );
                        }, [overlayCounter])}
                        disabled={baseCounter === 1}
                        size="small"
                        color="success"
                    >
                        Edit
                    </Button>
                    <Button
                        disabled={!toDeleteBase}
                        onClick={useCallback(() => {
                            removeBaseLayer('toDeleteBase');
                            setToDeleteBase(false);
                        }, [])}
                        color="error"
                        size="small"
                    >
                        Remove
                    </Button>
                </Box>

                <Box display="flex" flexWrap="wrap">
                    <Button
                        onClick={useCallback(() => {
                            if (!toDeleteOverlay) {
                                setToDeleteOverlay(true);
                                addOverlayLayer({
                                    id: 'toDeleteOverlay',
                                    title: 'toDeleteOverlay',
                                    ...overlayLayerSettings(0),
                                });
                                return;
                            } else {
                                addOverlayLayer({
                                    id: 'overlay' + overlayCounter,
                                    title: 'overlay' + overlayCounter,
                                    ...overlayLayerSettings(baseCounter),
                                });
                                setOverlayCounter(overlayCounter + 1);
                            }
                        }, [overlayCounter, toDeleteOverlay])}
                        variant='contained'
                        size="small"
                    >
                        Add Overlay Layer
                    </Button>
                    <Button
                        onClick={useCallback(() => {
                            if (activeOverlay) {
                                let crtId = parseInt(
                                    activeOverlay.replace('overlay', '')
                                );
                                crtId = crtId + 1;
                                if (crtId >= overlayCounter) {
                                    crtId = 1;
                                }
                                setActiveOverlayLayer(`overlay${crtId}`);
                            } else {
                                setActiveOverlayLayer('overlay1');
                            }
                        }, [overlayCounter, activeOverlay, overlays])}
                        disabled={
                            Object.keys(overlays).length === 0 ||
                            overlayCounter === 1
                        }
                        size="small"
                    >
                        Set Current
                    </Button>
                    <Button
                        onClick={useCallback(() => {
                            editOverlayLayer(
                                {
                                    id: 'overlay1',
                                    title: 'overlay1',
                                    ...overlayLayerSettings(baseCounter),
                                },
                                true
                            );
                        }, [baseCounter])}
                        disabled={overlayCounter === 1}
                        size="small"
                        color="success"
                    >
                        Edit
                    </Button>
                    <Button
                        disabled={!toDeleteOverlay}
                        onClick={useCallback(() => {
                            removeOverlayLayer('toDeleteOverlay');
                            setToDeleteOverlay(false);
                        }, [])}
                        color="error"
                        size="small"
                    >
                        Remove
                    </Button>
                </Box>
            </Box>
            <div
                tabIndex={0}
                id={mapId}
                ref={mapRef}
                style={mapStyle}
            />
        </Box>
    )
}

const initialView = {
    center: [0, 0],
    zoom: 1,
};

const onError = () => { }


// Base for all stories in this file.
const Template: StoryFn<StoryProps> = () => {
    console.log("[Template] render");
    return (
        <IntlProvider locale="en" onError={onError}>
            <QgisMapController initialView={initialView}>
                <Inner />
                <MapDebugger />
            </QgisMapController>
        </IntlProvider>
    );
}


/**
 * The default story.
 */
export const Default: StoryFn<StoryProps> = Template.bind({});
Default.args = {};
