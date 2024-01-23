import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';

import { MapDebugController } from "./controller";
import { MapDebugger } from '../debugger';


// The properties passed to each story.
type StoryProps = any;


// Common configuration for all stories.
const storybookConfig: Meta<StoryProps> = {
    title: 'debug/controller',
    tags: [],
    component: MapDebugController,
};
export default storybookConfig;

// Base for all stories in this file.
const Template: StoryFn<StoryProps> = () => {
    return (
        <MapDebugController>
            <MapDebugger />
        </MapDebugController>
    );
}


/**
 * The default story.
 */
export const Default: StoryFn<StoryProps> = Template.bind({});
Default.args = {};
