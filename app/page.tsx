'use client';

import React, { useState, useContext, useEffect } from 'react';
import Image from 'next/image';
import { Navbar } from './_components/ui/Navbar';
import CameraComponent from './_components/ui/CameraComponent';
import FoodList from './_components/ui/FoodList';
import {
  handleImageUpload,
  handleImageCapture,
  handleAnalysis,
  handleSaveToAlacena,
  handleJsonAnalysis,
} from '../utils/imageHandlers';
import { DataContext } from './_components/DataContext';
import { FoodItem, ScannedCollection } from '../utils/types';

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [jsonResponse, setJsonResponse] = useState<FoodItem[] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { scannedCollections, setScannedCollections, allFoodItems, loadScannedCollections, loadAllFoodItems } =
    useContext(DataContext);

  useEffect(() => {
    loadScannedCollections();
    loadAllFoodItems();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (response) {
      handleJsonAnalysis(response, setJsonResponse);
    }
  }, [response]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (file) {
      await handleAnalysis(file, setResponse, image);
    }
  };

  const onReset = () => {
    window.scrollTo({ top: 0 });
    setFile(null);
    setImage(null);
    setResponse('');
    setJsonResponse(null);
    setSubmitted(false);
  };

  const handleSave = async () => {
    if (jsonResponse && image) {
      const title = `Escaneo ${new Date().toLocaleString()}`;
      await handleSaveToAlacena(
        jsonResponse,
        setScannedCollections,
        loadScannedCollections,
        loadAllFoodItems,
        onReset,
        image,
        title
      );
    }
  };

  return (
    <main className="flex flex-col items-center bg-bpwhite">
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

        <CameraComponent
          onUploadPhoto={(photo) => handleImageUpload(photo, setFile, setImage)}
          onTakePhoto={(photo) => handleImageCapture(photo, setFile, setImage)}
        />
      </div>
      <div className="flex flex-col min-h-[101vh] w-full rounded-t-2xl p-5 pb-28 z-10 gap-1 bg-gray-100">
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

            {/* DEV TOOLS */}
            <div className="flex flex-col">
              <button
                className="flex w-full justify-center items-center bg-black/10 text-black font-semibold py-2 px-4 border-2 border-black rounded shadow hover:bg-black/20"
                onClick={() => console.log(scannedCollections)}
              >
                <p className="text-center text-spwhite">Print scannedCollections</p>
              </button>
              <p>{response ? `[${response}]` : 'No response yet'}</p>
            </div>

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
                    <FoodList
                      scannedCollections={[
                        {
                          _id: 'temp',
                          title: 'Escaneo actual',
                          image,
                          items: jsonResponse,
                          dateAdded: new Date().toISOString(),
                        },
                      ]}
                      setScannedCollections={setScannedCollections}
                      allFoodItems={jsonResponse}
                    />
                    <button
                      onClick={handleSave}
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
          {scannedCollections.length > 0 ? (
            <FoodList
              scannedCollections={scannedCollections}
              setScannedCollections={setScannedCollections}
              allFoodItems={allFoodItems}
            />
          ) : (
            <div className="flex flex-col items-start w-full border-2 border-gray-200 bg-gray-100 rounded-lg p-4">
              Tu lista de alimentos escaneados previamente aparecerá aquí
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center fixed bottom-0 z-50 w-full">
        <Navbar selected="Escanea" />
      </div>
    </main>
  );
};

export default Home;
