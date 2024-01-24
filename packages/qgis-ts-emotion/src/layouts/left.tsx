import { FC } from "react";
import { BarProps, ZIndex, barSize } from "./defs";


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
export const LeftBar: FC<BarProps> = ({ children, ...rest }) => (
    <div
        style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            minWidth: barSize,
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
