import Header from '@/components/Header'

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Vidéo en fond */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-"
        src="videos/video.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/video-placeholder.jpg" // ✅ image affichée pendant le chargement
      />
      {/* Overlay noir transparent */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10" />
      {/* Contenu au-dessus */}
      <div className="relative z-10 flex flex-col h-full">
        <Header dark={true} />
        <main className="flex-1 flex items-center justify-center text-white text-center px-4">
          <div>
            <h1 className="text-4xl font-clash font-medium">Gaspard Mariotte</h1>
            <p className="mt-2 text-xl font-satoshi">Artiste peintre muraliste</p>
          </div>
        </main>
      </div>
    </div>
  )
}

