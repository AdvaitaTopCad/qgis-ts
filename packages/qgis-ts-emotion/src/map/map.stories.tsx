import type { StoryFn, Meta } from '@storybook/react';

import type { QgisMapProps } from "./map";
import { QgisMap } from "./map";
import { IntlProvider } from 'react-intl';


// The properties passed to each story.
type StoryProps = QgisMapProps;


// Common configuration for all stories.
const storybookConfig: Meta<StoryProps> = {
    title: 'emotion/map',
    tags: [],
    component: QgisMap,
    args: {

    },
};
export default storybookConfig;

// Base for all stories in this file.
const Template: StoryFn<StoryProps> = () => {
    return (
        <IntlProvider locale="en" onError={() => {}}>
            <QgisMap />
        </IntlProvider>
    );
}

/**
 * The default story.
 */
export const Default: StoryFn<StoryProps> = Template.bind({});
Default.args = {};
