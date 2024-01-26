import { FC } from "react";
import { BarProps, ZIndex, barSize } from "./defs";


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
export const BottomBar: FC<BarProps> = ({ children, ...rest }) => (
    <div
        style={{
            position: 'absolute',
            bottom: 0,
            left: barSize,
            right: barSize,
            minHeight: barSize,
            backgroundColor: 'transparent',
            zIndex: ZIndex.Bar,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            ...rest
        }}
    >
        {children}
    </div>
)
