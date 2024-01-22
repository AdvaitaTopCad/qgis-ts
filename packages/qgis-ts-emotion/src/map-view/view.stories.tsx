import type { StoryFn, Meta } from '@storybook/react';

import type { QgisMapViewProps } from "./view";
import { QgisMapView } from "./view";
import { QgisMapContextProvider } from '@qgis-ts/react';




// The properties passed to each story.
type StoryProps = QgisMapViewProps;


// Common configuration for all stories.
const storybookConfig: Meta<StoryProps> = {
    title: 'emotion/map-view',
    tags: [],
    component: QgisMapView,
    args: {

    },
};
export default storybookConfig;


// Base for all stories in this file.
const Template: StoryFn<StoryProps> = () => {
    return (
        <QgisMapContextProvider value={{

        } as any}>
            <QgisMapView />
        </QgisMapContextProvider>
    );
}


/**
 * The default story.
 */
export const Default: StoryFn<StoryProps> = Template.bind({});
Default.args = {};
