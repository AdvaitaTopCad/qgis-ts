import type { StoryFn, Meta } from '@storybook/react';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import BuildIcon from '@mui/icons-material/Build';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { MapDebugController } from '@qgis-ts/debug';
import { QgisMapView } from '@qgis-ts/react';

import { BarProps } from './defs';
import { LeftBar } from './left';
import { BottomBar } from './bottom';
import { RightBar } from './right';
import { TopBar } from './top';

// The properties passed to each story.
type StoryProps = BarProps & { buttonCount: number };


// Common configuration for all stories.
const storybookConfig: Meta<StoryProps> = {
    title: 'layouts/left-bar',
    tags: [],
    component: LeftBar,
    args: {
        buttonCount: 3,
    },
};
export default storybookConfig;


const createButtons: (count: number) => JSX.Element[] = (count) => {
    const buttons: JSX.Element[] = [];
    for (let i = 0; i < count; i++) {
        const kind = i % 5;
        switch (kind) {
            case 0:
                buttons.push(
                    <IconButton key={`home${i}`} color="primary" size="small">
                        <HomeIcon />
                    </IconButton>
                );
                break;
            case 1:
                buttons.push(
                    <IconButton key={`build${i}`} color="primary" size="small">
                        <BuildIcon />
                    </IconButton>
                );
                break;
            case 2:
                buttons.push(
                    <IconButton key={`alarm${i}`} color="primary" size="small">
                        <AlarmIcon />
                    </IconButton>
                );
                break;
            case 3:
                buttons.push(
                    <IconButton key={`del${i}`} color="primary" size="small">
                        <DeleteIcon />
                    </IconButton>
                );
                break;
            case 4:
                buttons.push(
                    <IconButton key={`shop${i}`} color="primary" size="small">
                        <AddShoppingCartIcon />
                    </IconButton>
                );
                break;
            default:
                throw new Error(`Unexpected kind ${kind}`);
        }
    }

    return buttons;
}

// Base for all stories in this file.
const Template: StoryFn<StoryProps> = ({
    buttonCount
}) => {
    return (
        <MapDebugController>
            <QgisMapView>
                <LeftBar backgroundColor='red'>
                    {createButtons(buttonCount)}
                </LeftBar>
                <RightBar backgroundColor='lightgray' border="1px solid black" />
                <TopBar backgroundColor='lightgray' border="1px solid black" />
                <BottomBar backgroundColor='lightgray' border="1px solid black" />
            </QgisMapView>
        </MapDebugController>
    );
}


export const Default = Template.bind({});
Default.args = {};
