import { FC } from "react";
import { BarProps, ZIndex, barSize } from "./defs";
import { useQgisMapDisplayContext } from "../map";


/**
 * A helper component that displays its children in a vertical column on the
 * left side of the map, from bottom to top.
 *
 * If the children do not fit in the available space, they will be wrapped
 * to the next column.
 *
 * To lay the children from top to bottom, set the `flexDirection` property
 * to `column`.
 */
export const LeftBar: FC<BarProps> = ({ children, ...rest }) => {
    const { buttonSize } = useQgisMapDisplayContext();
    const finalSize = buttonSize === "small" ? "32px" : (
        buttonSize === "medium" ? "40px" : "48px"
    );
    return (
        <div
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                minWidth: finalSize,
                top: 0,
                backgroundColor: 'transparent',
                zIndex: ZIndex.Bar,
                display: "flex",
                flexDirection: "column-reverse",
                flexWrap: "wrap",
                ...rest
            }}
        >
            {children}
        </div>
    )
}
