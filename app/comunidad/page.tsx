'use client';
import Navbar from '../ui/Navbar';

export default function Home() {
  return (
    <main className="flex flex-col items-center bg-bpwhite">
      <div className="flex flex-col h-screen w-full">
        <div className="flex w-full items-center justify-center p-8">
          <p className="text-2xl font-semibold">Comunidad</p>
        </div>
        <div className="flex flex-col p-4 gap-2 h-full overflow-auto"></div>
      </div>
      <div className="flex justify-center fixed bottom-0 z-50 w-full">
        <Navbar selected="Chefsito" />
      </div>
    </main>
  );
}
