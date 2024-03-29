import { FC } from "react";
import {
    BottomBar, LeftBar, MapLayerComp, MousePosition, QgisMapController,
    QgisMapControllerProps, QgisMapView, RightBar, ScaleBar, TopBar
} from "@qgis-ts/react";

import {
    BaseLayersButton, FullScreenSwitcher, HomeButton, MyLocationButton,
    OverlayLayersButton, SettingsButton, ZoomInButton, ZoomOutButton
} from "../buttons";
import { QgisAppBar } from "../components";
import { SettingsDrawer } from "../settings";


/**
 * Properties expected by the StandardApp component.
 */
export interface QgisStandardAppProps extends QgisMapControllerProps {

}


const viewStyle = {
    height: "100vh",
    width: "100vw",
    minWidth: '100px',
    minHeight: '200px',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
}


/**
 * A map that covers the whole screen.
 */
export const QgisStandardApp: FC<QgisStandardAppProps> = ({
    children,
    ...rest
}) => {
    return (
        <QgisMapController {...rest}>
            <QgisAppBar />
            <QgisMapView style={viewStyle}>
                <FullScreenSwitcher side="tr" />
                <BottomBar>
                    <MousePosition />
                    <ScaleBar />
                </BottomBar>
                <LeftBar />
                <RightBar>
                    <SettingsButton />
                    <ZoomOutButton />
                    <ZoomInButton />
                    <BaseLayersButton />
                    <OverlayLayersButton />
                    <MyLocationButton />
                    <HomeButton />
                </RightBar>
                <TopBar />
            </QgisMapView>
            {children}
            <SettingsDrawer />
        </QgisMapController>
    );
}
