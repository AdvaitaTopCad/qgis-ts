import React from 'react';
import { FC } from 'react';
import { useQgisMapContext } from '@qgis-ts/react';


// The style we use for the inner div.
const sxDiv = {
    width: '100%',
    height: '100%',
    minWidth: '100px',
    minHeight: '100px',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    backgroundColor: 'white',
    margin: 0,
    padding: 0,
};



/**
 * Properties expected by the QGis map component.
 */
export interface QgisMapViewProps {
    children?: React.ReactNode;
};


/**
 * The QGis map component.
 */
export const QgisMapView: FC<QgisMapViewProps> = ({
    children
}) => {
    const {
        mapId,
        mapRef
    } = useQgisMapContext()
    return (
        <div
            style={sxDiv}
            id={mapId}
            ref={mapRef}
        >
            {children}
        </div>
    );
};
