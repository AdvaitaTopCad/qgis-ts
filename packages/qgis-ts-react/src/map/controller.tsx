import { FC, ReactNode, useReducer } from 'react';
import { combineReducers } from 'redux';

import { QgisMapContextProvider } from './context';
import type { QgisMapContext } from './context';
import { reducerObject, initialState } from './store';


/**
 * Properties expected by the QGis map controller.
 */
export interface QgisMapControllerProps {
    children: ReactNode;
};


/**
 * The QGis map controller.
 */
export const QgisMapController: FC<QgisMapControllerProps> = ({
    children
}) => {

    const [state, dispatch] = useReducer(
        combineReducers(reducerObject), initialState
    );

    // Compute the value that will be provided through the context.
    const value: QgisMapContext = {
        ...state
    };

    return (
        <QgisMapContextProvider value={value}>
            {children}
        </QgisMapContextProvider>
    );
};
