import { FC } from "react";
import { MapLayer, } from "@qgis-ts/react";
import { Tree } from 'react-arborist';
import { styled } from '@mui/material';

import { LayerSettings } from "./settings";
import { useLayerTreeContext } from "./context";
import { TreeNode } from "./layer-node";
import { LayerTreeController } from "./controller";


/**
 * The wrapper that can be hidden.
 */
const HidableDiv = styled('div', {
    shouldForwardProp: (prop) => prop !== 'hidden',
    name: 'HidableDiv',
})(({
    hidden
}) => ({
    display: hidden ? 'none' : 'block',
    margin: 0,
    padding: 0,
}));


/**
 * The properties expected by the OverlayTree component.
 *
 * These will be passed to the Tree component.
 */
export interface OverlayTreeProps {
    rowHeight?: number;
    overscanCount?: number;
    width?: number | string;
    height?: number;
    indent?: number;
    paddingTop?: number;
    paddingBottom?: number;
    padding?: number;
};


/**
 * The tree of layers.
 */
export const OverlayTreeInner: FC<OverlayTreeProps> = (props) => {
    const {
        currentLayer,
        treeData,
        childrenAccessor,
        onCreate,
        onRename,
        onMove,
        onDelete
    } = useLayerTreeContext();

    console.log("[OverlayTree] data=%O", treeData);
    return (
        <>
            <HidableDiv hidden={currentLayer !== null}>
                <Tree<MapLayer>
                    data={treeData}
                    childrenAccessor={childrenAccessor}
                    // idAccessor?: string | ((d: T) => string);
                    onCreate={onCreate}
                    onRename={onRename}
                    onMove={onMove}
                    onDelete={onDelete}
                    openByDefault={true}
                    {...props}
                >
                    {TreeNode}
                </Tree >
            </HidableDiv>
            <HidableDiv hidden={currentLayer === null}>
                <LayerSettings />
            </HidableDiv>
        </>
    );
};


/**
 * The tree of layers.
 */
export const OverlayTree: FC<OverlayTreeProps> = (props) => {
    return (
        <LayerTreeController>
            <OverlayTreeInner {...props} />
        </LayerTreeController>
    )
};
