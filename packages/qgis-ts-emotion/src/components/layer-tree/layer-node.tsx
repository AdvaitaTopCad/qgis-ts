import { GROUP_GENRE_ID, MapLayer } from "@qgis-ts/react";
import { NodeRendererProps } from "react-arborist";

import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import SettingsIcon from '@mui/icons-material/Settings';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useLayerTreeContext } from "./context";
import { ChangeEvent } from "react";


/**
 * Renders a single layer node.
 */
export function TreeNode({
    node, style, dragHandle, preview
}: NodeRendererProps<MapLayer>) {

    // Get the context.
    const {
        setCurrentLayer,
        editOverlayLayer,
    } = useLayerTreeContext();

    // Handler for making a layer visible or invisible.
    const onSettingsClick = () => {
        setCurrentLayer(node.data.id);
    };

    // Handler for changing the visibility of a layer.
    const onVisibilityChange = (event: ChangeEvent<HTMLInputElement>) => {
        editOverlayLayer({
            ...node.data,
            visible: event.target.checked
        });
    };

    console.log("[TreeNode] %s visibility %O", node.data.id, node.data.visible);
    return (
        <ListItem
            dense
            style={style}
            ref={dragHandle as any}
            secondaryAction={
                <IconButton
                    edge="end"
                    aria-label="settings"
                    size="small"
                    disabled={node.data.genre === GROUP_GENRE_ID}
                    onClick={onSettingsClick}
                >
                    {node.data.genre === GROUP_GENRE_ID ? (
                        <FolderOpenIcon fontSize="small" />
                    ) : (
                        <SettingsIcon fontSize="small" />
                    )}
                </IconButton>
            }
        >
            <Checkbox
                checked={node.data.visible ?? true}
                onChange={onVisibilityChange}
            />
            <ListItemButton onClick={() => node.toggle()}>
                <ListItemText primary={node.data.title} />
            </ListItemButton>
        </ListItem>
    );
}
