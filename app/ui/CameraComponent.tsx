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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none" fillRule="evenodd">
            <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z" />
            <path
              fill="#1F1803"
              d="M14.793 3a1.5 1.5 0 0 1 .95.34l.11.1L17.415 5H20a2 2 0 0 1 1.995 1.85L22 7v12a2 2 0 0 1-1.85 1.995L20 21H4a2 2 0 0 1-1.995-1.85L2 19V7a2 2 0 0 1 1.85-1.995L4 5h2.586l1.56-1.56a1.5 1.5 0 0 1 .913-.433L9.207 3h5.586Zm-.207 2H9.414l-1.56 1.56a1.5 1.5 0 0 1-.913.433L6.793 7H4v12h16V7h-2.793a1.5 1.5 0 0 1-.95-.34l-.11-.1L14.585 5ZM12 7.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
            />
          </g>
        </svg>
        <p className="text-bpblack font-semibold">Capturar imagen</p>
      </button>
    </div>
  );
};

export default CameraComponent;
