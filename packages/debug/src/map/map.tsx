import { MapLayerComp, QgisMapController, QgisMapView } from "@qgis-ts/react";
import { FC, ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { MapDebugger } from "../debugger";


/**
 * Properties expected by the SimpleMap component.
 */
export interface SimpleMapProps {
    /**
     * The children of the component.
     */
    children?: ReactNode;

    /**
     * Children placed in the vertical bar at the right side of the map..
     */
    buttonChildren?: ReactNode;
}


/**
 * A simple map that places its children in the bottom-right corner.
 */
export const SimpleMap: FC<SimpleMapProps> = ({
    children,
    buttonChildren,
}) => {
    return (
        <IntlProvider locale="en">
            <QgisMapController initialView={{
                center: [0, 0],
                zoom: 0,
            }}>
                <QgisMapView>
                    <MapLayerComp
                        layerKind="base"
                        activate
                        settings={{
                            id: "osm",
                            title: "OpenStreetMap",
                            genre: 'osm-tile-raster',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            minWidth: 32,
                            top: 0,
                            backgroundColor: 'transparent',
                            zIndex: 5000,
                            display: "flex",
                            flexDirection: "column-reverse",
                            flexWrap: "wrap",
                        }}
                    >
                        {buttonChildren}
                    </div>
                    {children}
                </QgisMapView>
                <MapDebugger />
            </QgisMapController>
        </IntlProvider>
    );
}
