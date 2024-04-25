import ImageClassifier from './ui/imageClassifier';

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white text-black items-center p-24">
      <ImageClassifier />
    </main>
  );
}
