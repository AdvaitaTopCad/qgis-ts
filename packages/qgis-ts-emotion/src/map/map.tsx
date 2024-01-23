import React from 'react';
import { FC } from 'react';
import type { QgisMapControllerProps } from '@qgis-ts/react';
import { QgisMapController } from '@qgis-ts/react';

import { QgisMapView } from '../map-view';


/**
 * Properties expected by the QGis map component.
 */
export interface QgisMapProps extends QgisMapControllerProps {

};


/**
 * The QGis map component.
 */
export const QgisMap: FC<QgisMapProps> = ({
    children,
    ...rest
}) => {

    return (
        <QgisMapController {...rest}>
            <QgisMapView>
                {children}
            </QgisMapView>
        </QgisMapController>
    );
};
