import type { StoryFn, Meta } from '@storybook/react';

import type { MapLayerProps } from './component';
import { MapLayerComp } from './component';
import { MapLayer } from './defs';
import { MapDebugController, MapDebugger } from '@qgis-ts/debug';


// The properties passed to each story.
type StoryProps = MapLayerProps<MapLayer>;


// Common configuration for all stories.
const storybookConfig: Meta<StoryProps> = {
    title: 'react/component',
    tags: [],
    component: MapLayerComp,
    args: {

    },
};
export default storybookConfig;


// Base for all stories in this file.
const Template: StoryFn<StoryProps> = () => {
    return (
        <MapDebugController>
            <MapLayerComp>
                <MapLayerComp>
                    <MapLayerComp
                        layerKind="base"
                        settings={{
                            id: "osm",
                        }}
                    />
                    <MapLayerComp
                        layerKind="base"
                        settings={{
                            id: "google",
                        }}
                    />
                </MapLayerComp>
                <MapLayerComp>
                    <MapLayerComp
                        layerKind="overlay"
                        settings={{
                            id: "one",
                        }}
                    >
                        <MapLayerComp
                            layerKind="overlay"
                            settings={{
                                id: "one-one",
                            }}
                        >
                            <MapLayerComp
                                layerKind="overlay"
                                settings={{
                                    id: "one-one-one",
                                }}
                            />
                        </MapLayerComp>
                    </MapLayerComp>
                    <MapLayerComp
                        layerKind="group"
                        settings={{
                            id: "two",
                        }}
                    >
                        <MapLayerComp
                            layerKind="group"
                            settings={{
                                id: "two-one",
                            }}
                        >
                            <MapLayerComp
                                layerKind="overlay"
                                settings={{
                                    id: "two-one-one",
                                }}
                            />
                        </MapLayerComp>
                        <MapLayerComp
                            layerKind="overlay"
                            settings={{
                                id: "two-two",
                            }}
                        />
                    </MapLayerComp>
                </MapLayerComp>
                <MapLayerComp
                    layerKind="overlay"
                    settings={{
                        id: "three",
                    }}
                >
                    <MapLayerComp />
                </MapLayerComp>
            </MapLayerComp>

            <MapDebugger />
        </MapDebugController>
    );
}

/**
 * The default story.
 */
export const Default: StoryFn<StoryProps> = Template.bind({});
Default.args = {};
