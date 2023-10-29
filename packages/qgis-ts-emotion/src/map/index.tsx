import { FC } from 'react';
import { QgisMapController } from '@qgis-ts/react';

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
            <p>Hello, there, stranger</p>
        </QgisMapController>
    );
};
