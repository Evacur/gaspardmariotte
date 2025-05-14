import { client, urlFor } from '../lib/sanity'

export async function getStaticProps() {
  const projets = await client.fetch(`*[_type == "projet"]`)
  return { props: { projets } }
}

export default function Projets({ projets }) {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Mes projets</h1>
      {projets.map((projet) => (
        <div key={projet._id} style={{ marginBottom: "3rem" }}>
          <h2>{projet.titre}</h2>
          <p>{projet.description}</p>
          {projet.image && (
            <img
              src={urlFor(projet.image).width(600).url()}
              alt={projet.titre}
              style={{ maxWidth: "100%", borderRadius: "12px" }}
            />
          )}
          {projet.lien && (
            <p>
              <a href={projet.lien} target="_blank" rel="noopener noreferrer">
                Voir le projet
              </a>
            </p>
          )}
        </div>
      ))}
    </main>
  )
}
