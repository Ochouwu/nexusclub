'use client'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import '../style.css'

export default function CarnetPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id') || 'SIN-ID'

  return (
    <main className="main-container">
      <video autoPlay loop muted className="background-video">
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div className="content fade-in">
        <h1 className="title">Carnet</h1>
        <Image
          src="/carnet.png"
          alt="Carnet"
          width={600}
          height={400}
          priority
        />
        <p className="id-display">ID: {id}</p>
      </div>
    </main>
  )
}


