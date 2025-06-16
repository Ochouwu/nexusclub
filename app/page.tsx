'use client';
import { useEffect, useRef, useState } from 'react';
import './style.css';
import { doc, getDoc } from 'firebase/firestore';
import { db, getUserFiles } from './firebase/firebase';

type DatosUsuario = {
  examenA: number;
  examenB: number;
  categoria: string;
  caducidad: string;
  hb: string;
};

export default function Home() {
  const [mostrarIntro, setMostrarIntro] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarCarnet, setMostrarCarnet] = useState(false);
  const [id, setId] = useState('');
  const [datos, setDatos] = useState<DatosUsuario | null>(null);
  const [urls, setUrls] = useState<{ [key: string]: string }>({});

  const videoRef = useRef<HTMLVideoElement>(null);

  const manejarInicio = () => setMostrarIntro(true);

  useEffect(() => {
    if (mostrarIntro && videoRef.current) {
      videoRef.current.play();
      videoRef.current.onended = () => {
        setMostrarIntro(false);
        setMostrarLogin(true);
      };
    }
  }, [mostrarIntro]);

  const manejarVerCarnet = () => {
    if (id.trim() !== '') {
      setMostrarLogin(false);
      setMostrarCarnet(true);
    }
  };

  useEffect(() => {
    const fetchDatos = async () => {
      if (!id) return;
      try {
        const ref = doc(db, 'usuarios', id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setDatos(snap.data() as DatosUsuario);
          const urlsObtenidas = await getUserFiles(id);
          setUrls(urlsObtenidas);
        } else {
          alert('ID no encontrado.');
          setMostrarCarnet(false);
          setMostrarLogin(true);
        }
      } catch (err) {
        console.error('Error obteniendo datos:', err);
      }
    };

    if (mostrarCarnet) fetchDatos();
  }, [mostrarCarnet]);

  const notaA = datos?.examenA || 0;
  const notaB = datos?.examenB || 0;
  const notaFinal = Math.round((notaA + notaB) / 2);

  const descargarArchivo = async (url: string, nombre: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const enlace = document.createElement('a');
      enlace.href = URL.createObjectURL(blob);
      enlace.download = nombre;
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
      URL.revokeObjectURL(enlace.href);
    } catch (error) {
      console.error('Error al descargar:', error);
      alert('No se pudo descargar el archivo.');
    }
  };

  const descargarCarnetImagen = () => {
    descargarArchivo(urls['carnetoff.png'] || '', 'carnet_hd.png');
  };

  const descargarCarnetPDF = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = urls['carnetoff.png'] || '';
    img.onload = async () => {
      const { default: jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = img.width;
      const imgHeight = img.height;
      let scaledWidth = pageWidth;
      let scaledHeight = (imgHeight * scaledWidth) / imgWidth;
      if (scaledHeight > pageHeight) {
        scaledHeight = pageHeight;
        scaledWidth = (imgWidth * scaledHeight) / imgHeight;
      }
      const x = (pageWidth - scaledWidth) / 2;
      const y = (pageHeight - scaledHeight) / 2;
      pdf.addImage(img, 'PNG', x, y, scaledWidth, scaledHeight);
      pdf.save('carnet.pdf');
    };
  };

  const descargarExamen = (tipo: 'a' | 'b') => {
    const fileKey = tipo === 'a' ? 'examen_a.pdf' : 'examen_b.pdf';
    descargarArchivo(urls[fileKey] || '', fileKey);

    const tooltip = document.getElementById(`tooltip-${tipo}`);
    if (tooltip) {
      tooltip.classList.add('visible');
      setTimeout(() => tooltip.classList.remove('visible'), 2000);
    }
  };

  return (
    <main className="main-container">
      <video autoPlay loop muted className="background-video">
        <source src="/background.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>

      {!mostrarIntro && !mostrarLogin && !mostrarCarnet && (
        <button className="intro-button" onClick={manejarInicio}>
          <img src="/logo.png" alt="Logo" className="logo" />
        </button>
      )}

      {mostrarIntro && (
        <div className="intro-video-container fade-out">
          <video
            ref={videoRef}
            className="intro-video"
            src="/intro.mp4"
            muted={false}
            playsInline
            controls={false}
          />
        </div>
      )}

      {mostrarLogin && (
        <div className="login-container fade-in-up">
          <div className="login-header">
            <img src="/logo.png" alt="Logo" className="logo" />
            <h1 className="login-title">Login</h1>
          </div>
          <input
            className="input-id"
            type="text"
            placeholder="Ingresa tu ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <button className="glass-button" onClick={manejarVerCarnet}>
            Ver carnet
          </button>
        </div>
      )}

      {mostrarCarnet && datos && (
        <>
          <div className="carnet-container fade-in-up">
            <div className="carnet-left">
              {urls['carnetoff.png'] && (
                <img src={urls['carnetoff.png']} className="carnet-img" />
              )}

              <div className="button-group">
                <button className="glass-button download-button" onClick={descargarCarnetImagen}>
                  Descargar Imagen
                </button>
                <button className="glass-button download-button" onClick={descargarCarnetPDF}>
                  Descargar PDF
                </button>
              </div>
            </div>

            <div className="carnet-right glass-panel">
              <h2 className="section-title">Resumen del Usuario</h2>

              <div className="exam-row">
                <span>Examen A</span>
                <div className="glass-grade blue hover-scale" onClick={() => descargarExamen('a')} style={{ cursor: 'pointer' }}>
                  {notaA}
                </div>
                <span id="tooltip-a" className="glass-tooltip">📄 Examen A descargado</span>
              </div>

              <div className="exam-row">
                <span>Examen B</span>
                <div className="glass-grade blue hover-scale" onClick={() => descargarExamen('b')} style={{ cursor: 'pointer' }}>
                  {notaB}
                </div>
                <span id="tooltip-b" className="glass-tooltip">📄 Examen B descargado</span>
              </div>

              <div className="exam-row">
                <span>Nota Final</span>
                <div className="glass-grade green hover-scale" style={{ cursor: 'pointer' }}>
                  {notaFinal}
                </div>
              </div>

              <h3 className="section-subtitle">Contrato</h3>
              <div className="contract-status">
                <div className="glass-grade green with-circle" style={{ cursor: 'pointer' }}>
                  <span>Activo</span>
                  <div className="pulsating-circle inside"></div>
                </div>
              </div>
              <div className="contract-status">
                <div className="glass-contract red">
                  Caducidad: {datos?.caducidad}
                </div>
              </div>
              <div className="contract-status">
                <div className="glass-contract yellow">
                  <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>HB: {datos?.hb}</span>
                </div>
              </div>

              <h3 className="section-subtitle">Categoría</h3>
              <div className="glass-category center-content">
                <img src={urls['ceo.png'] || ''} alt={datos?.categoria || 'Categoría'} className="ceo-img" />
                <strong>{datos?.categoria}</strong>
              </div>
            </div>
          </div>

          <div className="dual-insignias-container">
            <img src={urls['insigniasl.png'] || ''} alt="Insignias Izquierda" className="dual-insignias-img" />
            <img src={urls['insigniasr.png'] || ''} alt="Insignias Derecha" className="dual-insignias-img" />
          </div>
        </>
      )}

      <footer className="copyright-footer">
        © Nexus / Creator: Ocho - Renato V. 2025
      </footer>
    </main>
  );
}































































































































































