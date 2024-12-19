"use client";

import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Image from "next/image";

const WebcamCapture: React.FC = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null); // Store the API response
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
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
      setCapturedImage(imageSrc); // Store the captured image
    }
  };

  // Function to send the image to the API
  const sendImageToApi = async () => {
    if (!capturedImage) {
      alert("No image captured!");
      return;
    }

    setLoading(true);
    try {
      const imageBase64 = capturedImage; // The base64 image

      const response = await axios.post(
        "https://ai-entity.onrender.com/api/ai/vision-question",
        {
          question: "Describe the image", // Static question
          base64_image: imageBase64.split(",")[1], // Remove the data URL prefix
        }
      );

      setResponse(response.data.response); // Set the response from the API
      setIsModalOpen(true); // Open the modal to display the response
    } catch (error) {
      console.error("Error fetching response:", error);
      alert("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      {!isCameraOpen ? (
        <button
          onClick={openCamera}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Open Camera
        </button>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }} // Use the back camera
            className="rounded-lg shadow-lg border-2 border-gray-300"
          />
          <button
            onClick={capture}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Capture Photo
          </button>
        </div>
      )}

      {/* Display the captured image */}
      {capturedImage && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-700">Captured Image:</h3>
          <Image width={200} height={200} unoptimized  src={capturedImage} alt="Captured" className="mt-2 rounded-lg shadow-md max-w-xs" />
        </div>
      )}

      {/* Send captured image to the API */}
      {capturedImage && (
        <button
          onClick={sendImageToApi}
          className="mt-4 px-6 py-3 bg-yellow-600 text-white font-semibold rounded-md shadow-md hover:bg-yellow-700 transition duration-300 ease-in-out"
          disabled={loading}
        >
          {loading ? "Processing..." : "Send Image to AI"}
        </button>
      )}

      {/* Modal to display response */}
      {isModalOpen && response && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">AI Response</h2>
            <p className="text-lg text-gray-700 mb-4">{response}</p>
            <button
              onClick={closeModal}
              className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition duration-300 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
