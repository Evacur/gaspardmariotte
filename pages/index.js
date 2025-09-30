import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="videos/video.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/video-placeholder.png"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10" />

      <div className="relative z-20 flex flex-col h-full">
        <Header dark={true} />
        <main className="flex-1 flex items-center justify-center text-white text-center px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-clash font-black">
              Gaspard Mariotte
            </h1>
            <p className="mt-2 text-xl md:text-2xl font-satoshi">
              Artiste peintre muraliste
            </p>
          </div>
        </main>
        <Footer dark={true} />
      </div>
    </div>
  )
}
