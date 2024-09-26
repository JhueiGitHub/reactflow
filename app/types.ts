// app/types.ts
import { Node, NodeProps } from "reactflow";

export interface AssetNodeData {
  label: string;
  wallpaper: string;
  dockIcons: string[];
}

export type CustomNode = Node<AssetNodeData, "assetNode">;

export type NodeTypes = {
  assetNode: React.ComponentType<NodeProps<AssetNodeData>>;
};
