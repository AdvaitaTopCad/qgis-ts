import { createContext, useContext } from "react";
import { MouseState } from "./mouse.slice";


/**
 * The data about the mouse that is stored in
 * context for each map.
 */
export type QgisMapMouseContext = MouseState;

// The context object.
const theContext = createContext<QgisMapMouseContext | null>(null);

/**
 * The provider used to wrap react component to allow them access to
 * map data.
 */
export const QgisMapMouseContextProvider = theContext.Provider;


/**
 * The hook to use for retrieving the data from context about the QGis map.
 */
export const useQgisMapMouseContext = () => {
    const context = useContext(theContext);
    if (context === null) {
        throw new Error('QgisMapMouseContextProvider not found');
    }

    return context;
}
