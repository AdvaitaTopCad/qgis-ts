import { createContext, useContext } from "react";
import { ProjState, ProjectionId } from "./proj.slice";


/**
 * The state related to projections: list and current.
 */
export interface QgisMapProjContext extends ProjState {
    /**
     * The function to change the current projection.
     */
    setActiveProj: (newProj: ProjectionId) => void;
};


// The context object.
const theContext = createContext<QgisMapProjContext | null>(null);


/**
 * The provider used to wrap react component to allow them access to
 * projection data.
 */
export const QgisMapProjContextProvider = theContext.Provider;


/**
 * The hook to use for retrieving the underlying OpenLayers map from context.
 */
export const useQgisMapProjContext = () => {
    const context = useContext(theContext);
    if (context === null) {
        throw new Error('QgisMapProjContextProvider not found');
    }

    return context;
}
