// PhotoCapture.tsx
import React, { useState, useRef } from 'react';
import {FileMeta, ICoords } from "~/component/FileMeta";

interface PhotoCaptureProps {
  category: string | null;
  onBack: () => void;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ category, onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileMeta = new FileMeta(file);
    try {
      const coords = await fileMeta.getGPSCoords();
      if (coords) {
        setGpsCoords({
          lat: Number(coords.lat),
          lng: Number(coords.lng)
        });
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  const handleSend = async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    // Here you would implement the S3 upload logic
    // For demo purposes, we'll just log it
    console.log('Sending photo to S3...');
    alert('Photo would be uploaded to S3 in a real implementation');
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <button
        onClick={onBack}
        className="mb-4 text-blue-500 hover:text-blue-700"
      >
        ← Back to Categories
      </button>

      <h2 className="text-xl font-bold">{category}</h2>

      {!image ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCapture}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Take Photo
          </button>
          <p className="mt-2 text-gray-500">Or select from gallery</p>
        </div>
      ) : (
        <div className="space-y-4">
          <img src={image} alt="Captured" className="w-full rounded-lg" />

          <div className="flex justify-between items-center">
            <span className="font-semibold">{category}</span>
            <button
              onClick={handleSend}
              className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
            >
              Send
            </button>
          </div>

          {gpsCoords && (
            <div className="mt-4">
              <a
                href={`https://maps.google.com/?q=${gpsCoords.lat},${gpsCoords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Location on Google Maps
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoCapture;