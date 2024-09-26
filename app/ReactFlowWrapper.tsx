"use client";

import React from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import { CustomNode, NodeTypes } from "./types";
import { AssetNode } from "./customNodes";

const nodeTypes: NodeTypes = {
  assetNode: AssetNode,
};

interface ReactFlowWrapperProps {
  initialNodes: CustomNode[];
}

const ReactFlowWrapper: React.FC<ReactFlowWrapperProps> = ({ initialNodes }) => {
  return (
    <ReactFlow
      nodes={initialNodes}
      nodeTypes={nodeTypes}
      fitView
    />
  );
};

export default ReactFlowWrapper;
