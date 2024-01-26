import type { StoryFn, Meta } from '@storybook/react';

import type { QgisMapProps } from "./map";
import { QgisMap } from "./map";
import { IntlProvider } from 'react-intl';
import { MapDebugger, MapDebuggerDialogBtn } from '@qgis-ts/debug';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import BuildIcon from '@mui/icons-material/Build';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';
import { Divider } from '@mui/material';
import { HomeButton } from '../buttons/home';
import { ZoomInButton } from '../buttons/zoom-in';
import { ZoomOutButton } from '../buttons/zoom-out';
import { BaseLayersButton } from '../buttons/base-layers';
import { MyLocation } from '@mui/icons-material';
import { MyLocationButton } from '../buttons/my-loc';
import { OverlayLayersButton } from '../buttons/overlay-layers';
import { MapLayerComp, RightBar } from '@qgis-ts/react';

// The properties passed to each story.
type StoryProps = QgisMapProps;


// Common configuration for all stories.
const storybookConfig: Meta<StoryProps> = {
    title: 'emotion/map',
    tags: [],
    component: QgisMap,
    args: {

    },
};
export default storybookConfig;

// The style we use for the inner div.
const sxDiv = {
    width: '100%',
    height: '700px',
    minWidth: '100px',
    minHeight: '200px',
    // We need this so that we can position the map controls.
    position: 'relative' as const,
    overflow: 'hidden' as const,
    backgroundColor: 'yellow',
    margin: 0,
    padding: 0,
};

// Base for all stories in this file.
const Template: StoryFn<StoryProps> = () => {
    return (
        <IntlProvider locale="en" onError={() => { }}>
            <QgisMap
                initialView={{
                    center: [0, 0],
                    zoom: 1,
                }}
                style={sxDiv}
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
                </MapLayerComp>
                <RightBar>
                    <MapDebuggerDialogBtn />
                    <ZoomOutButton />
                    <ZoomInButton />
                    <BaseLayersButton />
                    <OverlayLayersButton />
                    <MyLocationButton />
                    <HomeButton />
                </RightBar>
            </QgisMap>
        </IntlProvider>
    );
}

/**
 * The default story.
 */
export const Default: StoryFn<StoryProps> = Template.bind({});
Default.args = {};
