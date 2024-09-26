// components/ReactFlowComponent.tsx

"use client";

import React, { useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { useDropzone } from "react-dropzone";
import "reactflow/dist/style.css";

interface ReactFlowComponentProps {
  initialImage: string | null;
}

const CustomNode = ({ data }: { data: { label: string; image: string } }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.success) {
              data.image = result.imageUrl;
              // Trigger a re-render
              // This is a simplified approach; in a real app, you'd want to update the node state
            }
          })
          .catch((error) => console.error("Upload error:", error));
      }
    },
    [data]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      style={{
        padding: 10,
        border: "1px solid black",
        borderRadius: 5,
        background: "white",
      }}
    >
      <div
        {...getRootProps()}
        style={{ width: 100, height: 100, border: "2px dashed gray" }}
      >
        <input {...getInputProps()} />
        {data.image ? (
          <img
            src={data.image}
            alt="Uploaded"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : isDragActive ? (
          <p>Drop the image here ...</p>
        ) : (
          <p>Drag 'n' drop an image here, or click to select one</p>
        )}
      </div>
      <div>{data.label}</div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const ReactFlowComponent: React.FC<ReactFlowComponentProps> = ({
  initialImage,
}) => {
  const initialNodes: Node[] = [
    {
      id: "1",
      type: "custom",
      position: { x: 0, y: 0 },
      data: { label: "Upload Image", image: initialImage || "" },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowComponent;
