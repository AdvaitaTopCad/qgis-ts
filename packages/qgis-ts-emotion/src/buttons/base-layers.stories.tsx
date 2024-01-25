import type { StoryFn, Meta } from '@storybook/react';
import { SimpleMap } from '@qgis-ts/debug';

import { BaseButtonProps } from './base';
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
        <SimpleMap>
            <BaseLayersButton {...props} />
        </SimpleMap>
    );
}


export const Default = Template.bind({});
Default.args = {};
