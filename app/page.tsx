import Image from 'next/image';
import Navbar from './ui/Navbar';
import SectionsMenu from './ui/SectionsMenu';

export default async function Home() {
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
        <div className="rounded-lg p-3 mt-8 bg-white">
          <div className="relative aspect-square h-6">
            <Image className="" src="/images/lantern.png" alt="hero" fill />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full bg-spwhite rounded-t-2xl p-5 pb-20 z-10 gap-1 bg-white">
        <div className="flex flex-col text-spblack text-center text-pretty gap-4">
          <p className="text-2xl font-semibold py-8">Historial</p>
          <p className="leading-5">
            description
            <br /> <br />
            oneliner
          </p>
        </div>
        {/* <SectionsMenu /> */}
        {/* {children} */}
      </div>
      <div className="flex justify-center fixed bottom-0 z-50 w-full">
        <Navbar />
      </div>
    </main>
  );
}
