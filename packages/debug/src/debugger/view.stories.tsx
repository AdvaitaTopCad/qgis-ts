import type { StoryFn, Meta } from '@storybook/react';

import { MapDebugger } from "./view";
import { IntlProvider } from 'react-intl';
import { QgisMapController } from '@qgis-ts/react';


// The properties passed to each story.
type StoryProps = any;


// Common configuration for all stories.
const storybookConfig: Meta<StoryProps> = {
    title: 'debug/view',
    tags: [],
    component: MapDebugger,
};
export default storybookConfig;

// Base for all stories in this file.
const Template: StoryFn<StoryProps> = () => {
    return (
        <IntlProvider locale="en" onError={() => { }}>
            <QgisMapController initialView={{}}>
                <MapDebugger />
            </QgisMapController>
        </IntlProvider>
    );
}


/**
 * The default story.
 */
export const Default: StoryFn<StoryProps> = Template.bind({});
Default.args = {};
