import type { StoryFn, Meta } from '@storybook/react';
import { Box, Button } from '@mui/material';
import type { QgisMapControllerProps } from './controller';
import { QgisMapController } from './controller';
import { MapDebugger } from '@qgis-ts/debug';
import { IntlProvider } from 'react-intl';
import { FC, useCallback, useState } from 'react';
import { useQgisMapContext } from './context';


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

const Inner: FC = () => {
    console.log("[Inner] render");
    const {
        mapId,
        mapRef,
        layers: {
            bases,
            activeBase,
            overlays,
            activeOverlay,
        },
        addBaseLayer,
        removeBaseLayer,
        editBaseLayer,
        setActiveBaseLayer,
        addOverlayLayer,
        removeOverlayLayer,
        setActiveOverlayLayer,
        editOverlayLayer,
    } = useQgisMapContext();

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
                                addBaseLayer({ id: 'toDeleteBase' });
                                return;
                            } else {
                                addBaseLayer({ id: 'base' + baseCounter });
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
                                    opacity: overlayCounter,
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
                                addOverlayLayer({ id: 'toDeleteOverlay' });
                                return;
                            } else {
                                addOverlayLayer({
                                    id: 'overlay' + overlayCounter
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
                                    opacity: baseCounter,
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
