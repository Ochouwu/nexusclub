'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './style.css';

function CarnetContent() {
  const [mostrarCarnet, setMostrarCarnet] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const carnetRef = useRef<HTMLDivElement>(null);

  const handleVerCarnet = () => {
    if (id) {
      localStorage.setItem('mostrarCarnet', 'true');
      setMostrarCarnet(true);
    }
  };

  useEffect(() => {
    const mostrar = localStorage.getItem('mostrarCarnet');
    if (mostrar === 'true') {
      setMostrarCarnet(true);
    }
  }, []);

  const descargarImagen = () => {
    if (!carnetRef.current) return;
    html2canvas(carnetRef.current).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'mi-carnet.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const descargarPDF = () => {
    if (!carnetRef.current) return;
    html2canvas(carnetRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('mi-carnet.pdf');
    });
  };

  return (
    <div className="main-container">
      <video autoPlay muted loop className="background-video">
        <source src="/video-fondo.mp4" type="video/mp4" />
      </video>
      {!mostrarCarnet && (
        <div className="login-container">
          <h1 className="glass-button">🎮 Iniciar Sesión</h1>
          <input type="text" placeholder="Ingresa tu ID" className="input-login" />
          <button onClick={handleVerCarnet} className="glass-button">
            Ver carnet
          </button>
        </div>
      )}
      {mostrarCarnet && (
        <div className="carnet-container">
          <div className="left-panel">
            <h2 className="title">🪪 Carnet Oficial</h2>
            <div className="carnet-image" ref={carnetRef}>
              <img src="/carnet.png" alt="Carnet del usuario" />
            </div>
            <div className="botones-carnet">
              <button className="glass-button" onClick={descargarImagen}>
                Descargar imagen
              </button>
              <button className="glass-button" onClick={descargarPDF}>
                Descargar PDF
              </button>
            </div>
            <div className="evaluaciones">
              <h3>Evaluaciones:</h3>
              <div className="notas">
                <button className="nota-button">A: 18</button>
                <button className="nota-button">B: 17</button>
              </div>
              <button className="nota-final" title="Promedio A y B. Desde 11 aprueba.">
                Nota Final: 17.5
              </button>
            </div>
          </div>
          <div className="right-panel">
            <h2 className="title grande">Resumen del Usuario</h2>
            <div className="info-usuario">
              <p><strong>Nombre:</strong> Renato V.</p>
              <p>
                <strong>Categoría:</strong>{' '}
                <button className="glass-blue" title="Usuario nuevo del club">A0</button>
              </p>
              <p>
                <strong>Contrato:</strong>{' '}
                <button className="glass-green" title="Caduca en diciembre">
                  Activo <span className="pulsante"></span>
                </button>
              </p>
            </div>
            <h3 className="ciclos-titulo">Ciclos Nexus</h3>
            <div className="ciclos-container">
              <div className="insignia">
                <img src="/ciclo1.png" alt="Ciclo 1" />
                <p>Inicio (2022)</p>
              </div>
              <div className="insignia">
                <img src="/ciclo2.png" alt="Ciclo 2" />
                <p>Exploración (2023)</p>
              </div>
              <div className="insignia">
                <img src="/ciclo3.png" alt="Ciclo 3" />
                <p>Expansión (2024)</p>
              </div>
              <div className="insignia">
                <img src="/ciclo4.png" alt="Ciclo 4" />
                <p>Dominio (2025)</p>
              </div>
            </div>
            <h3>Videojuegos Favoritos</h3>
            <div className="juegos">
              <img src="/zelda.png" alt="Zelda" />
              <img src="/pokemon.png" alt="Pokemon" />
              <img src="/mario.png" alt="Mario" />
            </div>
            <p className="footer">© Nexus / Creator: Ocho - Renato V. 2025</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Cargando carnet...</div>}>
      <CarnetContent />
    </Suspense>
  );
}

































































































































































