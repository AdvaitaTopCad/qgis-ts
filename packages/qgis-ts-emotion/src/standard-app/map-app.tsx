import { FC } from "react";
import { BottomBar, LeftBar, MapLayerComp, QgisMapController, QgisMapControllerProps, QgisMapView, RightBar, TopBar } from "@qgis-ts/react";
import { BaseLayersButton, FullScreenSwitcher, HomeButton, MyLocationButton, OverlayLayersButton, ZoomInButton, ZoomOutButton } from "../buttons";


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
    ...rest
}) => {
    return (
        <QgisMapController {...rest}>
            <QgisMapView style={viewStyle}>
                <FullScreenSwitcher side="br" />
                <BottomBar />
                <LeftBar />
                <RightBar>
                    <ZoomOutButton />
                    <ZoomInButton />
                    <BaseLayersButton />
                    <OverlayLayersButton />
                    <MyLocationButton />
                    <HomeButton />
                </RightBar>
                <TopBar />
            </QgisMapView>
            <MapLayerComp>
                <MapLayerComp
                    layerKind="base"
                    activate
                    settings={{
                        id: "osm",
                        genre: 'osm-tile-raster',
                        title: 'OpenStreetMap',
                    }}
                />
            </MapLayerComp>
        </QgisMapController>
    );
}
