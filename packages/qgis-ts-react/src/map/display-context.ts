import { createContext, useContext } from "react";
import { DisplayState, UseDisplaySliceResult } from "./display.slice";


/**
 * The data about the UI that is stored in
 * context for each map.
 */
export interface QgisMapDisplayContext extends DisplayState, UseDisplaySliceResult {

    /**
     * The callback to enter or exit full screen mode.
     */
    setFullScreen: (fullScreen: boolean) => void;
}

// The context object.
const theContext = createContext<QgisMapDisplayContext | null>(null);

/**
 * The provider used to wrap react component to allow them access to
 * map data.
 */
export const QgisMapDisplayContextProvider = theContext.Provider;


/**
 * The hook to use for retrieving the data from context about the QGis map.
 */
export const useQgisMapDisplayContext = () => {
    const context = useContext(theContext);
    if (context === null) {
        throw new Error('QgisMapDisplayContextProvider not found');
    }

    return context;
}
