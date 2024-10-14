import { Dispatch, SetStateAction } from 'react';
import { FoodItem, ScannedCollection } from './types';

export const handleImageUpload = (
  photo: File,
  setFile: Dispatch<SetStateAction<File | null>>,
  setImage: Dispatch<SetStateAction<string | null>>
) => {
  setFile(photo);
  const reader = new FileReader();
  reader.onload = (e) => setImage(e.target?.result as string);
  reader.readAsDataURL(photo);
};

export const handleImageCapture = (
  photo: string,
  setFile: Dispatch<SetStateAction<File | null>>,
  setImage: Dispatch<SetStateAction<string | null>>
) => {
  setImage(photo);
  const [, base64Data] = photo.split(',');
  const byteCharacters = atob(base64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: 'image/jpeg' });
  setFile(new File([blob], 'photo.jpg', { type: 'image/jpeg' }));
};

export const handleAnalysis = async (
  file: File,
  setResponse: Dispatch<SetStateAction<string>>,
  image: string | null
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('image', image || ''); // Add the image data to formData
  try {
    const res = await fetch('/api/analyzeImage', {
      method: 'POST',
      body: formData,
    });
    const reader = res.body?.getReader();
    let fullResponse = '';
    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      const chunk = new TextDecoder().decode(value);
      fullResponse += chunk;
      setResponse(fullResponse);
    }
  } catch (error) {
    console.error('Error during analysis:', error);
    setResponse('Error during analysis');
  }
};

export const handleJsonAnalysis = (response: string, setJsonResponse: Dispatch<SetStateAction<FoodItem[] | null>>) => {
  try {
    const jsonResponse = JSON.parse(response);
    setJsonResponse(jsonResponse);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    setJsonResponse(null);
  }
};

export const handleSaveToAlacena = async (
  jsonResponse: FoodItem[],
  setScannedCollections: Dispatch<SetStateAction<ScannedCollection[]>>,
  loadScannedCollections: () => Promise<void>,
  loadAllFoodItems: () => Promise<void>,
  onReset: () => void,
  image: string | null,
  title: string
) => {
  try {
    const dataToSave: ScannedCollection = {
      title,
      image: image || '',
      items: jsonResponse,
      dateAdded: new Date().toISOString(),
    };

    const response = await fetch('/api/saveToAlacena', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSave),
    });

    if (!response.ok) {
      throw new Error('Failed to save to alacena');
    }

    const result = await response.json();
    console.log('Data saved successfully:', result);

    await loadScannedCollections();
    await loadAllFoodItems();
    onReset();
  } catch (error) {
    console.error('Error saving to alacena:', error);
  }
};
