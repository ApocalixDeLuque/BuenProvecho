'use client';
import React, { useState, useRef } from 'react';
import { Camera } from 'react-camera-pro';

interface CameraComponentProps {
  onTakePhoto: (photo: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onTakePhoto }) => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);

  const handleTakePhoto = () => {
    const photo = camera.current.takePhoto();
    setImage(photo);
    onTakePhoto(photo);
  };

  return (
    <div className="flex flex-col items-center w-full -z-20">
      <Camera
        ref={camera}
        errorMessages={{
          noCameraAccessible: undefined,
          permissionDenied: undefined,
          switchCamera: undefined,
          canvas: undefined,
        }}
      />
      <button className="flex z-50 sticky top-0 rounded-lg p-3 mt-8 bg-white gap-2" onClick={handleTakePhoto}>
        {/* SVG content */}
        <p className="text-bpblack font-semibold">Capturar imagen</p>
      </button>
    </div>
  );
};

export default CameraComponent;
