import { FC, useCallback, useEffect, useRef } from "react"
import OlControlScaleLine, {
    Options as ScaleLineOptions
} from 'ol/control/ScaleLine';
import OlMap from 'ol/Map'

import { useQgisMapContext } from "../../map";
import { styled } from "@mui/material";


/**
 * The outer container for the background buttons.
 */
const StyledDiv = styled('div', {
    name: 'ScaleBar',
})({
    ".ol-scale-line": {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
    }
});


/**
 * The properties expected by the ScaleBar component.
 */
export interface ScaleBarProps extends Omit<ScaleLineOptions, "target"> {

}


/**
 * The internal data of the ScaleBar component.
 */
export interface ScaleBarData {
    /**
     * The OpenLayers control that is used to display the scale bar.
     */
    control: OlControlScaleLine | null;

    /**
     * The OpenLayers map that is used to display the scale bar.
     */
    olMap: OlMap | null;

    /**
     * The node where the scale bar is rendered.
     */
    node: HTMLDivElement | null;
}


/**
 * A control that shows the current scale of the map, in terms of ratio of
 * a distance on the map to the corresponding distance on the ground.
 */
export const ScaleBar: FC<ScaleBarProps> = ({
    ...rest
}) => {
    console.log('[ScaleBar] render');

    // Get the map from the context.
    const { olMap } = useQgisMapContext();

    // The internal data of the component.
    const data = useRef<ScaleBarData>({
        node: null,
        control: null,
        olMap,
    });

    // Called with the DOM element when the component is mounted.
    const ref = useCallback((node: HTMLDivElement | null) => {
        if (!node || !olMap) return;
        if (data.current.control) {
            if (node === data.current.node) return;
            olMap.removeControl(data.current.control);
            console.log('[ScaleBar] the previous component was removed');
        }
        console.log('[ScaleBar] creating the component...');

        // Create the control.
        const control = new OlControlScaleLine({
            ...rest,
            target: node,
        });
        data.current.control = control;

        // Add it to the map.
        olMap.addControl(control);
        console.log('[ScaleBar] the component was added');
    }, [rest, olMap]);

    // On unmount remove the control from the map.
    useEffect(() => {
        return () => {
            if (!data.current.control || !data.current.olMap) return;

            data.current.olMap.removeControl(data.current.control);
            console.log('[ScaleBar] the component was removed');
        };
    }, []);

    return (
        <StyledDiv ref={ref} />
    );
}
