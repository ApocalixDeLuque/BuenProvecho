'use client';
import Image from 'next/image';
import Navbar from './ui/Navbar';
import CameraComponent from './ui/CameraComponent';
import { FormEvent, useEffect, useState } from 'react';

interface IItem {
  cantidad: string;
  categoría: string;
  'fecha de caducidad': string;
  'fecha del registro': string;
  nombre: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [jsonResponse, setJsonResponse] = useState<Record<string, any> | null>(null);
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <main className="flex flex-col items-center bg-gray-400">
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
      <div className="flex flex-col w-full bg-spwhite rounded-t-2xl p-5 pb-20 z-10 gap-1 bg-white">
        {file && image ? (
          <div className="flex flex-col text-spblack text-center text-pretty gap-4">
            <p className="text-2xl font-semibold py-8">Resultados</p>
            <div className="relative aspect-square w-full">
              {image && (
                <Image className="rounded-lg" src={image} alt="Taken photo" style={{ objectFit: 'cover' }} fill />
              )}
            </div>
            <form onSubmit={onSubmit} className="flex flex-row">
              <button
                className={`w-full ${
                  submitted || !file ? 'opacity-50' : 'hover:bg-gray-100'
                } bg-white mr-4 text-slate-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow`}
                type="submit"
                disabled={submitted || !file}
              >
                Analizar alimentos
              </button>
              <button
                className="w-full bg-white hover:bg-red-100 text-red-800 font-semibold py-2 px-4 border border-red-400 rounded shadow"
                type="button"
                onClick={onReset}
              >
                Volver a tomar
              </button>
            </form>
            <div>
              {jsonResponse &&
                jsonResponse.map((item, index) => (
                  <div key={index} style={{ margin: '10px 0' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Title: {item.title}</p>
                    <p>Quantity: {item.quantity}</p>
                    {/* Add more fields as needed */}
                  </div>
                ))}
            </div>
            <p className="py-8 text-slate-800">{submitted && !response ? 'Analizando imagen' : response}</p>
          </div>
        ) : (
          <div className="flex flex-col text-spblack text-center text-pretty gap-4">
            <p className="text-2xl font-semibold py-8">Historial</p>
            Lista de alimentos escaneados previamente aqui
          </div>
        )}

        {/* FUERA DE EL DIV PRINCIPAL
        <SectionsMenu /> */}
        {/* {children} */}
      </div>
      <div className="flex justify-center fixed bottom-0 z-50 w-full">
        <Navbar />
      </div>
    </main>
  );
}
