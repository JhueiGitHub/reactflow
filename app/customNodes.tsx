// app/customNodes.tsx
"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { useDropzone } from "react-dropzone";
import { AssetNodeData } from "./types";

export const AssetNode: React.FC<NodeProps<AssetNodeData>> = ({ data }) => {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentWallpaper, setCurrentWallpaper] = useState(data.wallpaper);
  const [currentDockIcons, setCurrentDockIcons] = useState(data.dockIcons);

  useEffect(() => {
    fetch("/api/upload")
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setCurrentWallpaper(result.wallpaper.url);
          setCurrentDockIcons(result.dockIcons.map((icon: any) => icon.url));
        }
      })
      .catch((error) => {
        console.error("Error fetching assets:", error);
      });
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[], type: "wallpaper" | "dockIcon") => {
      const file = acceptedFiles[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.success) {
              if (type === "wallpaper") {
                setCurrentWallpaper(result.result.url);
              } else {
                setCurrentDockIcons((prev) =>
                  [...prev, result.result.url].slice(-6)
                );
              }
              setUploadError(null);
            } else {
              throw new Error(result.error || "Upload failed");
            }
          })
          .catch((error) => {
            console.error("Upload error:", error);
            setUploadError(error.message);
          });
      }
    },
    []
  );

  const {
    getRootProps: getWallpaperProps,
    getInputProps: getWallpaperInputProps,
    isDragActive: isWallpaperDragActive,
  } = useDropzone({
    onDrop: (files) => onDrop(files, "wallpaper"),
    accept: "image/*" as any, // Change this line
  });

  const {
    getRootProps: getDockIconProps,
    getInputProps: getDockIconInputProps,
    isDragActive: isDockIconDragActive,
  } = useDropzone({
    onDrop: (files) => onDrop(files, "dockIcon"),
    accept: "image/*" as any, // Change this line
  });

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <div className="font-bold mb-2">{data.label}</div>
      <div
        {...getWallpaperProps()}
        className={`mb-2 border-2 border-dashed p-2 ${
          isWallpaperDragActive ? "border-blue-500" : "border-gray-300"
        }`}
      >
        <input {...getWallpaperInputProps()} />
        {isWallpaperDragActive ? (
          <p>Drop the wallpaper here ...</p>
        ) : (
          <img
            src={currentWallpaper}
            alt="Wallpaper"
            className="w-full h-auto"
          />
        )}
      </div>
      {uploadError && <div className="text-red-500 mt-2">{uploadError}</div>}
      <div
        {...getDockIconProps()}
        className={`flex space-x-2 p-2 ${
          isDockIconDragActive ? "border-blue-500" : "border-gray-300"
        }`}
      >
        <input {...getDockIconInputProps()} />
        {currentDockIcons.map((icon, index) => (
          <img
            key={index}
            src={icon}
            alt={`Dock Icon ${index + 1}`}
            className="w-8 h-8"
          />
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
