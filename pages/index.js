import Header from '@/components/header'

export default function Home() {
  return (
    <div>
      <Header />
      <main className="min-h-screen flex items-center justify-center text-white bg-black">
        <div className="text-center">
          <h1 className="text-4xl font-clash">Bienvenue sur mon site</h1>
          <p className="mt-2 font-satoshi">Artiste peintre muraliste</p>
        </div>
      </main>
    </div>
  )
}
