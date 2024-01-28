import { MapLayer, } from "@qgis-ts/react";
import { NodeApi, } from 'react-arborist';


export interface CreateProps<MapLayer> {
    parentId: string | null;
    parentNode: NodeApi<MapLayer> | null;
    index: number;
    type: "internal" | "leaf";
}

export interface RenameProps {
    id: string;
    name: string;
    node: NodeApi<MapLayer>;
}

export interface MoveProps {
    dragIds: string[];
    dragNodes: NodeApi<MapLayer>[];
    parentId: string | null;
    parentNode: NodeApi<MapLayer> | null;
    index: number;
}

export interface DeleteProps {
    ids: string[];
    nodes: NodeApi<MapLayer>[];
}

export interface IdObj {
    id: string;
  }
