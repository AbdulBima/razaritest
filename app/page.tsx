"use client";

import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

const WebcamCapture: React.FC = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  // Function to open the camera
  const openCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia is not supported in this browser.");
      alert("Your browser does not support camera access.");
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // If successful, set isCameraOpen to true to show the webcam
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Camera access denied or unavailable. Please check your camera settings.");
    }
  };

  // Function to capture the photo
  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log("Captured Image:", imageSrc);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {!isCameraOpen ? (
        <button
          onClick={openCamera}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Open Camera
        </button>
      ) : (
        <div className="flex flex-col items-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}

          />
          <button
            onClick={capture}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Capture Photo
          </button>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
