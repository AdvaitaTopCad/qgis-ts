import { FC } from "react";
import { BarProps, ZIndex, barSize } from "./defs";
import { useQgisMapDisplayContext } from "../map";


/**
 * A helper component that displays its children in a horizontal row at the
 * bottom of the map, from left to right.
 *
 * If the children do not fit in the available space, they will be wrapped
 * to the next row.
 *
 * To lay the children from right to left, set the `flexDirection` property
 * to `row-reverse`.
 */
export const BottomBar: FC<BarProps> = ({ children, ...rest }) => {
    const { buttonSize } = useQgisMapDisplayContext();
    const finalSize = buttonSize === "small" ? "32px" : (
        buttonSize === "medium" ? "40px" : "48px"
    );
    return (
        <div
            style={{
                position: 'absolute',
                bottom: 0,
                left: finalSize,
                right: finalSize,
                minHeight: finalSize,
                backgroundColor: 'transparent',
                zIndex: ZIndex.Bar,
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                ...rest
            }}
        >
            {children}
        </div>
    )
}
