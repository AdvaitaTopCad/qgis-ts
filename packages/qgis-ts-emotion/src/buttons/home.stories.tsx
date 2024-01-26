import type { StoryFn, Meta } from '@storybook/react';
import { SimpleMap } from '@qgis-ts/debug';

import { HomeButton } from './home';
import { BaseButtonProps } from './base';



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
        <SimpleMap buttonChildren={<HomeButton {...props} />} />
    );
}


export const Default = Template.bind({});
Default.args = {};
