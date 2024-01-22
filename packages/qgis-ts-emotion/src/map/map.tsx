import React from 'react';
import { FC } from 'react';
import { QgisMapController } from '@qgis-ts/react';

import { QgisMapView } from '../map-view';


/**
 * Properties expected by the QGis map component.
 */
export interface QgisMapProps {

};


/**
 * The QGis map component.
 */
export const QgisMap: FC<QgisMapProps> = (props) => {

    return (
        <QgisMapController>
            <QgisMapView />
        </QgisMapController>
    );
};
