import type { StoryFn, Meta } from '@storybook/react';
import { SimpleMap } from '@qgis-ts/debug';

import { BaseButtonProps } from './base';
import { OverlayLayersButton } from './overlay-layers';


// The properties passed to each story.
type StoryProps = Omit<BaseButtonProps, "children">;


// Common configuration for all stories.
const storybookConfig: Meta<StoryProps> = {
    title: 'buttons/overlays',
    tags: [],
    component: OverlayLayersButton,
    args: {

    },
};
export default storybookConfig;


// Base for all stories in this file.
const Template: StoryFn<StoryProps> = (props) => {
    return (
        <SimpleMap buttonChildren={<OverlayLayersButton {...props} />} />
    );
}


export const Default = Template.bind({});
Default.args = {};
