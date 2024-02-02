import { FC } from "react"
import OlControlMousePosition, {
    Options as MousePositionOptions
} from 'ol/control/MousePosition';

import { styled } from "@mui/material";
import { useOlControl } from "./use-ol-control";


/**
 * The outer container for the background buttons.
 */
const StyledDiv = styled('div', {
    name: 'MousePosition',
})({
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    ".ol-mouse-position": {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        minWidth: "100px",
        position: "static",
        fontFamily: "monospace",
        height: "1.7em",
        paddingLeft: "5px",
        paddingRight: "5px",
        boxSizing: "border-box",
        ":hover": {
            backgroundColor: "rgba(255, 255, 255, 0.7)",
        }
    },
    "select": {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        padding: "2px",
        margin: "2px",
        height: "2em",
        border: "none",
        boxSizing: "border-box",
        ":hover": {
            backgroundColor: "rgba(255, 255, 255, 0.7)",
        }
    }
});


/**
 * The properties expected by the ScaleBar component.
 */
export type MousePositionProps = Omit<MousePositionOptions, "target">;


/**
 * A control that shows the current scale of the map, in terms of ratio of
 * a distance on the map to the corresponding distance on the ground.
 */
export const MousePosition: FC<MousePositionProps> = (props) => {
    const data = useOlControl(OlControlMousePosition, props);
    return (
        <>
            <StyledDiv ref={data.ref}>
                <select id="projection" title="Projection">
                    <option value="EPSG:4326">EPSG:4326</option>
                    <option value="EPSG:3857">EPSG:3857</option>
                    <option value="EPSG:25832">EPSG:25832</option>
                    <option value="EPSG:25833">EPSG:25833</option>
                    <option value="EPSG:25834">EPSG:25834</option>
                </select>
            </StyledDiv>
        </>
    );
}
