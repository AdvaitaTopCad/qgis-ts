import type { StoryFn, Meta } from '@storybook/react';

import type { QgisMapProps } from "./map";
import { QgisMap } from "./map";
import { IntlProvider } from 'react-intl';
import { MapLayerComp } from 'packages/qgis-ts-react/src/layers';
import { MapDebugger } from '@qgis-ts/debug';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import BuildIcon from '@mui/icons-material/Build';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';
import { Divider } from '@mui/material';

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
    height: '300px',
    minWidth: '100px',
    minHeight: '300px',
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
                        }}
                    />
                </MapLayerComp>
                {/* <MapDebugger /> */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        //width: '50px',
                        top: 0,
                        backgroundColor: 'transparent',
                        zIndex: 1000,
                        display: "flex",
                        flexDirection: "column-reverse",
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    <IconButton aria-label="delete" color="primary" size="small">
                        <HomeIcon />
                    </IconButton>
                    <IconButton aria-label="delete" color="primary" size="small">
                        <BuildIcon />
                    </IconButton>
                    <Divider />
                    <IconButton aria-label="delete" color="primary" size="small">
                        <AlarmIcon />
                    </IconButton>
                    <IconButton aria-label="delete" color="primary" size="small">
                        <DeleteIcon />
                    </IconButton>
                    {/* <IconButton aria-label="delete" color="primary">
                        <HomeIcon />
                    </IconButton>
                    <IconButton aria-label="delete" color="primary">
                        <BuildIcon />
                    </IconButton>
                    <IconButton aria-label="delete" color="primary">
                        <AlarmIcon />
                    </IconButton>
                    <IconButton aria-label="delete" color="primary">
                        <AddShoppingCartIcon />
                    </IconButton> */}
                </div>
            </QgisMap>
        </IntlProvider>
    );
}

/**
 * The default story.
 */
export const Default: StoryFn<StoryProps> = Template.bind({});
Default.args = {};
