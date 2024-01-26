import type { StoryFn, Meta } from '@storybook/react';
import { SimpleMap } from '@qgis-ts/debug';

import type { FullScreenSwitcherProps } from './full-screen';
import { FullScreenSwitcher } from './full-screen';


// The properties passed to each story.
type StoryProps = FullScreenSwitcherProps;


// Common configuration for all stories.
const storybookConfig: Meta<StoryProps> = {
    title: 'buttons/full-screen',
    tags: [],
    component: FullScreenSwitcher,
    args: {
        side: "tl"
    },
};
export default storybookConfig;


// Base for all stories in this file.
const Template: StoryFn<StoryProps> = (props) => {
    return (
        <SimpleMap>
            <FullScreenSwitcher {...props} />
        </SimpleMap>
    );
}


export const Default = Template.bind({});
Default.args = {};
