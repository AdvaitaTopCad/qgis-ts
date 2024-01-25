import type { StoryFn, Meta } from '@storybook/react';
import { MapDebugController, MapDebugger } from '@qgis-ts/debug';

import { QgisMapView } from '../map-view';
import { BaseButtonProps } from './base';
import { RightBar } from '../layouts';
import { BaseLayersButton } from './base-layers';


// The properties passed to each story.
type StoryProps = Omit<BaseButtonProps, "children">;


// Common configuration for all stories.
const storybookConfig: Meta<StoryProps> = {
    title: 'buttons/base-layers',
    tags: [],
    component: BaseLayersButton,
    args: {

    },
};
export default storybookConfig;


// Base for all stories in this file.
const Template: StoryFn<StoryProps> = (props) => {
    return (
        <MapDebugController>
            <QgisMapView>
                <RightBar>
                    <BaseLayersButton {...props} />
                </RightBar>
            </QgisMapView>
            <MapDebugger />
        </MapDebugController>
    );
}


export const Default = Template.bind({});
Default.args = {};
