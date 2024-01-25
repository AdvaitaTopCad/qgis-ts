import { MapLayerComp, QgisMapController, QgisMapView } from "@qgis-ts/react";
import { ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { MapDebugger } from "../debugger";


/**
 * A simple map that places its children in the bottom-right corner.
 */
export const SimpleMap = ({children }: {children: ReactNode}) => {
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
                        {children}
                    </div>
                </QgisMapView>
                <MapDebugger />
            </QgisMapController>
        </IntlProvider>
    );
}
