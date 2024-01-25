import type { StoryFn, Meta } from '@storybook/react';
import { MapDebugController, MapDebugger } from '@qgis-ts/debug';

import { QgisMapView } from '../map-view';
import { HomeButton } from './home';
import { BaseButtonProps } from './base';
import { RightBar } from '../layouts';


// The properties passed to each story.
type StoryProps = Omit<BaseButtonProps, "children">;


// Common configuration for all stories.
const storybookConfig: Meta<StoryProps> = {
    title: 'buttons/home',
    tags: [],
    component: HomeButton,
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
                    <HomeButton {...props} />
                </RightBar>
            </QgisMapView>
            <MapDebugger />
        </MapDebugController>
    );
}


export const Default = Template.bind({});
Default.args = {};
