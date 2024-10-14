import React, { useRef } from 'react';
import { Camera } from 'react-camera-pro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faFileUpload } from '@fortawesome/free-solid-svg-icons';

interface CameraComponentProps {
  onTakePhoto: (photo: string) => void;
  onUploadPhoto: (photo: File) => void;
  disabled?: boolean;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onTakePhoto, onUploadPhoto, disabled }) => {
  const camera = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTakePhoto = () => {
    if (camera.current) {
      const photo = (camera.current as any).takePhoto();
      onTakePhoto(photo);
    }
  };

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const photo = e.target.files?.[0];
    if (photo) {
      onUploadPhoto(photo);
    }
  };

  if (disabled) {
    return null;
  }

  return (
    <div className="flex flex-col items-center w-full -z-20">
      <Camera
        ref={camera}
        facingMode="environment"
        errorMessages={{
          noCameraAccessible: undefined,
          permissionDenied: undefined,
          switchCamera: undefined,
          canvas: undefined,
        }}
      />
      <button className="flex z-50 sticky top-0 rounded-lg p-3 mt-8 bg-white gap-2" onClick={handleTakePhoto}>
        <FontAwesomeIcon icon={faCamera} className="h-6 w-6 text-black" />
        <p className="text-bpblack font-semibold">Capturar imagen</p>
      </button>
      <div
        onClick={handleOpenFileDialog}
        className="flex z-50 cursor-pointer sticky top-0 rounded-lg p-3 mt-8 bg-white gap-2"
      >
        <FontAwesomeIcon icon={faFileUpload} className="h-6 w-6 text-black" />
        <p className="text-bpblack font-semibold">Subir imagen</p>
        <input accept="image/*" type="file" ref={fileInputRef} onChange={handleUploadPhoto} hidden />
      </div>
    </div>
  );
};

export default CameraComponent;
