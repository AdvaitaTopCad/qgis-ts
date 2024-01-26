import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { LayerID, MapLayer, ROOT_LAYER_ID } from '../layers/defs';


/**
 * Information about the layers in a map.
 */
export interface LayersState {

    /**
     * The list of base layers.
     */
    bases: Record<LayerID, MapLayer>;

    /**
     * The active base layer.
     */
    activeBase: LayerID | undefined;

    /**
     * The flat list of overlay layers.
     */
    overlays: Record<LayerID, MapLayer>;

    /**
     * The active overlay layer.
     */
    activeOverlay: LayerID | undefined;

    /**
     * The tree of overlay layers.
     */
    layerTree: Record<LayerID, LayerID[]>;
};


const initialState: LayersState = {
    bases: {},
    activeBase: undefined,
    overlays: {},
    activeOverlay: undefined,
    layerTree: {},
};


/**
 * Current layers management.
 */
export const layersSlice = createSlice({
    name: 'layers',
    initialState,
    reducers: {
        setActiveBaseLayer: (
            state, action: PayloadAction<LayerID | undefined>
        ) => {
            if (action.payload !== undefined) {
                if (state.bases[action.payload] === undefined) {
                    throw new Error(`Unknown base layer ${action.payload}`);
                }
            }
            state.activeBase = action.payload;
        },

        setActiveOverlayLayer: (
            state, action: PayloadAction<LayerID | undefined>
        ) => {
            if (action.payload !== undefined) {
                if (state.overlays[action.payload] === undefined) {
                    throw new Error(`Unknown overlay layer ${action.payload}`);
                }
            }
            state.activeOverlay = action.payload;
        },

        addBaseLayer: (
            state, action: PayloadAction<{
                layer: MapLayer,
                activate?: boolean
            }>
        ) => {
            const layer = action.payload.layer;
            if (state.bases[layer.id] !== undefined) {
                throw new Error(`Map Layer ${layer.id} already exists`);
            }
            state.bases[layer.id] = layer;
            if (action.payload.activate) {
                state.activeBase = layer.id;
            }
        },

        removeBaseLayer: (
            state, action: PayloadAction<LayerID | null>
        ) => {
            // null means clear all.
            if (action.payload === null) {
                state.activeBase = undefined;
                state.bases = {};
                return;
            }

            // Remove it from the list.
            if (state.bases[action.payload] === undefined) {
                throw new Error(`Unknown base layer ${action.payload}`);
            }
            delete state.bases[action.payload];

            // Keep a consistent active state.
            if (state.activeBase === action.payload) {
                state.activeBase = undefined;
            }
        },

        editBaseLayer: (
            state, action: PayloadAction<{ layer: MapLayer, activate?: boolean }>
        ) => {
            const layer = action.payload.layer;
            if (state.bases[layer.id] === undefined) {
                throw new Error(`Unknown base layer ${layer.id}`);
            }
            state.bases[layer.id] = layer;
            if (action.payload.activate) {
                state.activeBase = layer.id;
            }
        },

        addOverlayLayer: (
            state, action: PayloadAction<{
                layer: MapLayer,
                activate?: boolean,
                index?: number,
            }>
        ) => {
            const layer = action.payload.layer;

            // Save the layer in the flat list.
            if (layer.id === ROOT_LAYER_ID) {
                throw new Error(`Map Layer ${layer.id} is reserved`);
            }
            if (state.overlays[layer.id] !== undefined) {
                throw new Error(`Map Layer ${layer.id} already exists`);
            }
            state.overlays[layer.id] = layer;

            // Mark it as active if requested.
            if (action.payload.activate) {
                state.activeOverlay = layer.id;
            }

            // Add it to the tree.
            const parentId = layer.parent || ROOT_LAYER_ID;
            let lst = state.layerTree[parentId];
            if (!lst) {
                lst = [layer.id];
            } else {
                lst = [...lst, layer.id];
            }
            state.layerTree[parentId] = lst;
        },

        removeOverlayLayer: (
            state, action: PayloadAction<LayerID | null>
        ) => {
            // null means clear all.
            if (action.payload === null) {
                state.activeOverlay = undefined;
                state.overlays = {};
                state.layerTree = {};
                return;
            }

            // Remove it from the flat list.
            const existing = state.overlays[action.payload];
            if (existing === undefined) {
                throw new Error(`Unknown overlay layer ${action.payload}`);
            }
            delete state.overlays[action.payload];

            // Keep a consistent active state.
            if (state.activeOverlay === action.payload) {
                state.activeOverlay = undefined;
            }

            // Get the list of children.
            const children = state.layerTree[action.payload];
            if (children !== undefined) {
                // Remove them recursively.
                for (const child of children) {
                    layersSlice.caseReducers.removeOverlayLayer(
                        state, {
                        payload: child,
                        type: action.type,
                    });
                }
            }

            // Remove it from the tree.
            const parentId = existing.parent || ROOT_LAYER_ID;
            const lst = state.layerTree[parentId];
            if (!lst) {
                throw new Error(`Missing layer tree for ${parentId}`);
            }
            const idx = lst.indexOf(action.payload);
            if (idx < 0) {
                throw new Error(`Missing layer ${action.payload} in layer tree`);
            }
            lst.splice(idx, 1);
            state.layerTree[parentId] = lst;
        },

        editOverlayLayer: (
            state, action: PayloadAction<{ layer: MapLayer, activate?: boolean }>
        ) => {
            const layer = action.payload.layer;
            if (state.overlays[layer.id] === undefined) {
                throw new Error(`Unknown overlay layer ${layer.id}`);
            }

            if (layer.parent !== action.payload.layer.parent) {
                // Remove it from the tree.
                const parentId = (
                    state.overlays[layer.id].parent ||
                    ROOT_LAYER_ID
                );
                const lst = state.layerTree[parentId];
                if (!lst) {
                    throw new Error(`Missing layer tree for ${parentId}`);
                }
                const idx = lst.indexOf(layer.id);
                if (idx < 0) {
                    throw new Error(`Missing layer ${layer.id} in layer tree`);
                }
                lst.splice(idx, 1);
                state.layerTree[parentId] = lst;

                // Add it to the tree.
                const newParentId = layer.parent || ROOT_LAYER_ID;
                let newLst = state.layerTree[newParentId];
                if (!newLst) {
                    newLst = [layer.id];
                } else {
                    newLst = [...newLst, layer.id];
                }
                state.layerTree[newParentId] = newLst;
            }

            // Save new content.
            state.overlays[layer.id] = layer;

            // Mark it as active if requested.
            if (action.payload.activate) {
                state.activeOverlay = layer.id;
            }
        },

        reorderOverlayLayer: (
            state, action: PayloadAction<{
                layer: LayerID,
                parent: LayerID | undefined,
                index: number,
            }>
        ) => {
            const { layer, parent, index } = action.payload;

            // Remove it from the tree.
            const parentId = (
                state.overlays[layer].parent ||
                ROOT_LAYER_ID
            );
            const lst = state.layerTree[parentId];
            if (!lst) {
                throw new Error(`Missing layer tree for ${parentId}`);
            }
            const idx = lst.indexOf(layer);
            if (idx < 0) {
                throw new Error(`Missing layer ${layer} in layer tree`);
            }
            lst.splice(idx, 1);
            state.layerTree[parentId] = lst;

            // Add it to the tree.
            const newParentId = parent || ROOT_LAYER_ID;
            let newLst = state.layerTree[newParentId];
            if (!newLst) {
                newLst = [layer];
            } else {
                newLst.splice(index, 0, layer);
            }
            state.layerTree[newParentId] = newLst;
        }
    },
});


export const {
    setActiveBaseLayer,
    setActiveOverlayLayer,
    addBaseLayer,
    removeBaseLayer,
    editBaseLayer,
    addOverlayLayer,
    removeOverlayLayer,
    editOverlayLayer,
    reorderOverlayLayer,
} = layersSlice.actions;
