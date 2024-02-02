import { FC } from "react"
import OlControlScaleLine, {
    Options as ScaleLineOptions
} from 'ol/control/ScaleLine';

import { styled } from "@mui/material";
import { useOlControl } from "./use-ol-control";


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
export type ScaleBarProps = Omit<ScaleLineOptions, "target">;


/**
 * A control that shows the current scale of the map, in terms of ratio of
 * a distance on the map to the corresponding distance on the ground.
 */
export const ScaleBar: FC<ScaleBarProps> = (props) => {
    const data = useOlControl(OlControlScaleLine, props);
    return (
        <StyledDiv ref={data.ref} />
    );
}
