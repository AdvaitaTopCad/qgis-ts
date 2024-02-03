import { FC } from "react"
import OlControlMousePosition, {
    Options as MousePositionOptions
} from 'ol/control/MousePosition';

import { styled } from "@mui/material";
import { useOlControl } from "./use-ol-control";
import { useQgisMapProjContext } from "../map/proj.context";
import { useIntl } from "react-intl";


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
    const {
        projection,
        projections,
        setActiveProj
    } = useQgisMapProjContext();
    console.log("[MousePosition] projection=%O", projection);
    console.log("[MousePosition] projections=%O", projections);

    const { formatMessage } = useIntl();

    const data = useOlControl(OlControlMousePosition, {
        projection: projections[projection],
        coordinateFormat: (coordinate: any) => {
            const units = projections[projection].getUnits();
            let digits = 2;
            if (units === "degrees") {
                digits = 7;
            } else if (units === "m") {
                digits = 3;
            } else if (units === "ft") {
                digits = 1;
            } else if (units === "us-ft") {
                digits = 1;
            } else if (units === "pixels") {
                digits = 0;
            } else if (units === "tile-pixels") {
                digits = 0;
            } else if (units === "radians") {
                digits = 5;
            }
            return coordinate.map(
                (value: any) => value.toFixed(digits)
            ).join(",");
        },
        ...props
    });

    return (
        <>
            <StyledDiv ref={data.ref}>
                <select
                    id="projection"
                    title={formatMessage({ id: "map.projection" })}
                    value={projection}
                    onChange={(event) => {
                        setActiveProj(event.target.value);
                    }}
                >
                    {Object.keys(projections).map((key) => (
                        <option key={key} value={key}>
                            {formatMessage({ id: key })}
                        </option>
                    ))}
                </select>
            </StyledDiv>
        </>
    );
}
