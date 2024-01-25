import React, { CSSProperties, FC } from 'react';
import { useQgisMapContext } from '@qgis-ts/react';


// The style we use for the inner div.
const sxDiv = {
    width: '100%',
    height: '200px',
    minWidth: '100px',
    minHeight: '200px',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    backgroundColor: 'grey',
    margin: 0,
    padding: 0,
};



/**
 * Properties expected by the QGis map component.
 */
export interface QgisMapViewProps {
    /**
     * The style of the inner component.
     */
    style?: CSSProperties;

    /**
     * The children of the component.
     */
    children?: React.ReactNode;
};


/**
 * The QGis map component.
 */
export const QgisMapView: FC<QgisMapViewProps> = ({
    style = sxDiv,
    children
}) => {
    const {
        mapId,
        mapRef
    } = useQgisMapContext()
    return (
        <div
            tabIndex={0}
            style={style}
            id={mapId}
            ref={mapRef}
        >
            {children}
        </div>
    );
};
