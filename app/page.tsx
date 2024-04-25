'use client';
import Image from 'next/image';
import Navbar from './ui/Navbar';
import CameraComponent from './ui/CameraComponent';
import { FormEvent, useEffect, useState } from 'react';
import FoodList from './ui/FoodList';
import { FoodItem } from './ui/FoodList';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [jsonResponse, setJsonResponse] = useState<FoodItem[] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [scannedGroup, setScannedGroup] = useState<FoodItem[]>([]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const formData = new FormData();
    formData.append('file', file as File);
    fetch('/api/classifystream', {
      method: 'POST',
      body: formData,
    }).then((res) => {
      const reader = res.body?.getReader();
      let tempResponse = '';
      return new ReadableStream({
        start(controller) {
          return pump();
          function pump(): any {
            return reader?.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                setResponse(tempResponse);
                return;
              }
              controller.enqueue(value);
              const decoded = new TextDecoder('utf-8').decode(value);
              tempResponse += decoded;
              return pump();
            });
          }
        },
      });
    });
  };

  useEffect(() => {
    if (response !== '') {
      try {
        const jsonResponse = JSON.parse(response);
        setJsonResponse(jsonResponse);
        console.log('response updated: ', jsonResponse);
      } catch (error) {
        console.error('Error parsing JSON: ', error);
      }
    }
  }, [response]);

  useEffect(() => {
    //console log when the file is updated
    console.log('file updated: ', file);
  }, [file]);

  const onReset = () => {
    window.scrollTo({ top: 0 });
    setFile(null);
    setImage(null);
    setResponse('');
    setJsonResponse(null);
    setSubmitted(false);
  };

  const handleTakePhoto = (photo: string) => {
    setImage(photo);
    const block = photo.split(';');
    const contentType = block[0].split(':')[1]; // In this case "image/gif"
    const realData = block[1].split(',')[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."
    const blob = b64toBlob(realData, contentType);
    setFile(new File([blob], 'photo.jpg', { type: contentType }));
  };

  const b64toBlob = (b64Data: string, contentType: string, sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const saveToAlacena = () => {
    console.log('Saving to alacena');
    setScannedGroup((prev) => {
      if (jsonResponse) {
        return [...prev, ...jsonResponse];
      } else {
        return prev;
      }
    });
    console.log('Scanned group updated: ', scannedGroup);
    onReset();
  };

  return (
    <main className="flex flex-col items-center bg-bpgreen">
      {/* Hero section */}
      <div className="flex flex-col w-full min-h-[80vh] text-white items-center sticky gap-2 top-0">
        <div className="flex relative w-full justify-center items-center text-spwhite gap-2 p-16 pb-8">
          <div className="relative aspect-square w-8 h-8">
            <Image className="rounded-lg" src="/images/icon.webp" alt="hero" fill />
          </div>
          <p className="text-center text-[28px] font-semibold leading-10">BuenProvecho</p>
        </div>
        <p className="font-semibold">Escanea tus alimentos</p>
        <div className="flex flex-col w-[80vw] h-[45vh] border-4 border-white border-dashed rounded-xl" />

        <CameraComponent onTakePhoto={handleTakePhoto} />
      </div>
      <div className="flex flex-col min-h-[101vh] w-full bg-spwhite rounded-t-2xl p-5 pb-28 z-10 gap-1 bg-white">
        <div className="flex self-center w-1/4 h-1.5 bg-gray-400 rounded-lg" />
        {file && image && (
          <div className="flex flex-col text-spblack text-center text-pretty pb-40 gap-4">
            <p className="text-2xl font-semibold py-8">Imagen tomada con éxito</p>
            <div className="relative aspect-square w-full">
              {image && (
                <Image className="rounded-lg" src={image} alt="Taken photo" style={{ objectFit: 'cover' }} fill />
              )}
            </div>
            <form onSubmit={onSubmit} className="flex flex-row">
              <button
                className={`w-full ${
                  submitted || !file ? 'opacity-50' : 'hover:bg-gray-100 bg-bpgreen/50 border-bpgreen'
                } bg-gray-200 mr-4 text-slate-800 font-semibold py-2 px-4 border-2 border-gray-300 rounded shadow`}
                type="submit"
                disabled={submitted || !file}
              >
                Analizar alimentos
              </button>
              <button
                className="w-full bg-red-200 hover:bg-red-300 text-red-800 font-semibold py-2 px-4 border-2 border-red-400 rounded shadow"
                type="button"
                onClick={onReset}
              >
                Volver a tomar
              </button>
            </form>
            {submitted && !jsonResponse && (
              <div className="flex flex-col items-center w-full font-bold border-2 border-gray-200 bg-gray-100 rounded-lg p-8 gap-4">
                <div className="relative w-8 aspect-square">
                  <Image src="/images/spinner.gif" alt="icon" fill />
                </div>
                Analizando alimentos...
              </div>
            )}

            {jsonResponse && (
              <>
                <p className="text-2xl font-semibold py-8">
                  Alimentos encontrados
                  <br /> en la imagen
                </p>
                {jsonResponse.length > 0 ? (
                  <>
                    <FoodList items={jsonResponse} />
                    <button
                      onClick={saveToAlacena}
                      className="w-full bg-bpgreen/50 hover:bg-bpgreen text-green-700 font-semibold py-2 px-4 border-2 border-bpgreen rounded shadow"
                    >
                      Guardar en alacena
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-start w-full border-2 border-red-200 bg-red-100 rounded-lg p-4">
                    No se encontraron alimentos almacenables en la imagen
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex flex-col text-spblack text-center text-pretty gap-4">
          <p className="text-2xl font-semibold py-8">Mi Alacena</p>
          {scannedGroup.length > 0 ? (
            <>
              <FoodList items={scannedGroup} />
            </>
          ) : (
            <div className="flex flex-col items-start w-full border-2 border-gray-200 bg-gray-100 rounded-lg p-4">
              Tu lista de alimentos escaneados previamente aparecerá aquí
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center fixed bottom-0 z-50 w-full">
        <Navbar />
      </div>
    </main>
  );
}
