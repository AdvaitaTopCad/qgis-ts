import React, { CSSProperties } from 'react';
import { FC } from 'react';
import type { QgisMapControllerProps } from '@qgis-ts/react';
import { QgisMapController } from '@qgis-ts/react';
import { QgisMapView } from '@qgis-ts/react';


/**
 * Properties expected by the QGis map component.
 */
export interface QgisMapProps extends QgisMapControllerProps {
    /**
     * The style of the inner component.
     */
    style?: CSSProperties;
};


/**
 * The QGis map component.
 */
export const QgisMap: FC<QgisMapProps> = ({
    children,
    style,
    ...rest
}) => {

    return (
        <QgisMapController {...rest}>
            <QgisMapView style={style}>
                {children}
            </QgisMapView>
        </QgisMapController>
    );
};
