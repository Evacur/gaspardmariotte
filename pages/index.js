import Header from '../components/header'
export default function Home() {
  return (
    <div>
      <Header />
      <main className="min-h-screen flex items-center justify-center text-white">
        <h1 className="text-4xl">Bienvenue sur mon site</h1>
      </main>
    </div>
  )
}