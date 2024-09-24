import Image from 'next/image';

export default async function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center w-full font-bold p-16 gap-4">
        <div className="relative w-8 aspect-square">
          <Image src="/images/spinner.gif" alt="icon" fill />
        </div>
        <div className="flex relative w-full justify-center items-center text-spwhite gap-2 p-16 pb-8">
          <div className="relative aspect-square w-8 h-8">
            <Image className="rounded-lg" src="/images/icon.webp" alt="hero" fill />
          </div>
          <p className="text-center text-[28px] font-semibold leading-10">BuenProvecho</p>
        </div>
      </div>
    </main>
  );
}
