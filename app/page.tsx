// app/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import AppWindow from "./components/AppWindow";

export default function Home() {
  const [latestImage, setLatestImage] = useState<string | null>(null);
  const [isAppOpen, setIsAppOpen] = useState(false);

  useEffect(() => {
    fetch("/api/latest-image")
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.image) {
          setLatestImage(data.image.url);
        }
      })
      .catch((error) => console.error("Error fetching latest image:", error));
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {latestImage && (
        <img
          src={latestImage}
          alt="Desktop Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            zIndex: -1,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <button
          onClick={() => setIsAppOpen(true)}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "25%",
            backgroundColor: "white",
            border: "1px solid black",
            cursor: "pointer",
          }}
        >
          App
        </button>
      </div>
      <AppWindow
        isOpen={isAppOpen}
        onClose={() => setIsAppOpen(false)}
        initialImage={latestImage}
      />
    </div>
  );
}
