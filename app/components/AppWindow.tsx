// components/AppWindow.tsx

import React from "react";
import ReactFlowComponent from "./ReactFlowComponent";

interface AppWindowProps {
  isOpen: boolean;
  onClose: () => void;
  initialImage: string | null;
}

const AppWindow: React.FC<AppWindowProps> = ({
  isOpen,
  onClose,
  initialImage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
        height: "80%",
        backgroundColor: "white",
        border: "1px solid black",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      <button
        onClick={onClose}
        style={{ position: "absolute", top: "10px", right: "10px" }}
      >
        Close
      </button>
      <ReactFlowComponent initialImage={initialImage} />
    </div>
  );
};

export default AppWindow;
