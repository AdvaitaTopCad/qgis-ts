import type { StoryFn, Meta } from '@storybook/react';
import { SimpleMap } from '@qgis-ts/debug';

import { BaseButtonProps } from './base';
import { SettingsButton } from './settings';


// The properties passed to each story.
type StoryProps = Omit<BaseButtonProps, "children">;


// Common configuration for all stories.
const storybookConfig: Meta<StoryProps> = {
    title: 'buttons/zoom-in',
    tags: [],
    component: SettingsButton,
    args: {

    },
};
export default storybookConfig;


// Base for all stories in this file.
const Template: StoryFn<StoryProps> = (props) => {
    return (
        <SimpleMap buttonChildren={<SettingsButton {...props} />} />
    );
}


export const Default: StoryFn<StoryProps> = Template.bind({});
Default.args = {};
