'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import '../style.css';

function CarnetClient() {
  const searchParams = useSearchParams();
  const [id, setId] = useState('SIN-ID');

  useEffect(() => {
    const paramId = searchParams.get('id');
    if (paramId) setId(paramId);
  }, [searchParams]);

  return (
    <main className="main-container">
      <video autoPlay loop muted className="background-video">
        <source src="/background.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
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
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="fallback">Cargando...</div>}>
      <CarnetClient />
    </Suspense>
  );
}







