import { useCallback, useEffect, useRef } from "react"
import OlMap from 'ol/Map'
import { useQgisOlMapContext } from "../map";
import { Control } from "ol/control";


/**
 * The internal data of the ScaleBar component.
 */
export interface UseOlControlData<T extends Control> {
    /**
     * The OpenLayers control that is used to display the scale bar.
     */
    control: T | null;

    /**
     * The OpenLayers map that is used to display the scale bar.
     */
    olMap: OlMap | null;

    /**
     * The node where the scale bar is rendered.
     */
    node: HTMLDivElement | null;

    /**
     * Used as reference for the react control
     */
    ref: (node: HTMLDivElement | null) => void;
}


/**
 * A hook for using an OpenLayers control in a React component.
 */
export function useOlControl<T extends Control>(ControlClass: any, props: any) {
    // Get the map from the context.
    const olMap = useQgisOlMapContext();
    console.log('[useOlControl] map is %O', olMap);


    // The internal data of the component.
    const data = useRef<UseOlControlData<T>>({
        node: null,
        control: null,
        olMap,
        ref: undefined as any,
    });


    // Called with the DOM element when the component is mounted.
    data.current.ref = useCallback((node: HTMLDivElement | null) => {
        if (!node || !olMap) return;
        if (data.current.control) {
            if (node === data.current.node) return;
            olMap.removeControl(data.current.control);
            console.log('[useOlControl] the previous component was removed');
        }
        console.log('[useOlControl] creating the component...');

        // Create the control.
        const control = new ControlClass({
            ...props,
            target: node,
        });
        data.current.control = control;

        // Add it to the map.
        olMap.addControl(control);
        console.log('[useOlControl] the component was added');
    }, [props, olMap]);


    // On unmount remove the control from the map.
    useEffect(() => {
        return () => {
            if (!data.current.control || !data.current.olMap) return;

            data.current.olMap.removeControl(data.current.control);
            console.log('[useOlControl] the component was removed');
        };
    }, []);


    return data.current;
}
