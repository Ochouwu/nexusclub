'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import './style.css';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';

const firebaseConfig = {
  apiKey: 'AIzaSyDgie1UTf1qd2ji28on7srL4m-Rvu2h34c',
  authDomain: 'nexus-card-94728.firebaseapp.com',
  projectId: 'nexus-card-94728',
  storageBucket: 'nexus-card-94728.appspot.com',
  messagingSenderId: '710725249036',
  appId: '1:710725249036:web:96bd5a7d44cae7e546e629',
  measurementId: 'G-H8TKF916CJ',
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

function CarnetContent() {
  const searchParams = useSearchParams();
  const idFromURL = searchParams.get('id') || '';

  const [mostrarIntro, setMostrarIntro] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarCarnet, setMostrarCarnet] = useState(false);
  const [urls, setUrls] = useState<any>({});
  const [id, setId] = useState(idFromURL);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [examenA, setExamenA] = useState(0);
  const [examenB, setExamenB] = useState(0);
  const [hb, setHB] = useState('');
  const [caducidad, setCaducidad] = useState('');
  const [categoria, setCategoria] = useState('');
  const notaFinal = Math.round((examenA + examenB) / 2);

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

  useEffect(() => {
    if (idFromURL) {
      manejarVerCarnet();
    }
  }, [idFromURL]);

  const obtenerDatosUsuario = async (userId: string) => {
    try {
      const docRef = doc(db, 'usuarios', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setExamenA(data.examenA || 0);
        setExamenB(data.examenB || 0);
        setHB(data.hb || '');
        setCaducidad(data.caducidad || '');
        setCategoria(data.categoria || '');
      } else {
        console.warn('❌ Documento no encontrado');
      }
    } catch (error) {
      console.error('⚠️ Error al obtener datos:', error);
    }
  };

  const manejarVerCarnet = async () => {
    const userId = idFromURL || id;
    if (userId.trim() === '') return;

    await obtenerDatosUsuario(userId);

    const files = [
      'carnetoff.png',
      'ceo.png',
      'insigniasl.png',
      'insigniasr.png',
      'examen_a.pdf',
      'examen_b.pdf',
    ];

    const fetchedUrls: any = {};

    await Promise.all(
      files.map(async (file) => {
        const path = `usuarios/${userId}/${file}`;
        try {
          const fileRef = ref(storage, path);
          const url = await getDownloadURL(fileRef);
          fetchedUrls[file] = url;
        } catch {
          fetchedUrls[file] = '';
        }
      })
    );

    setUrls(fetchedUrls);
    setMostrarLogin(false);
    setMostrarCarnet(true);
  };

  const descargarArchivo = (url: string, nombreArchivo: string) => {
    if (!url) {
      console.warn('⚠️ Archivo no disponible:', nombreArchivo);
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nombreArchivo);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="main-container">
      <video autoPlay loop muted className="background-video">
        <source src="/background.mp4" type="video/mp4" />
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
            autoPlay
            playsInline
            muted={false}
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

      {mostrarCarnet && (
        <>
          <div className="carnet-container fade-in-up">
            <div className="carnet-left">
              <img src={urls['carnetoff.png']} alt="Carnet" className="carnet-img" />
              <div className="button-group">
                <button
                  className="glass-button download-button"
                  onClick={() => descargarArchivo(urls['carnetoff.png'], 'carnet.png')}
                >
                  Descargar Imagen
                </button>
                <button
                  className="glass-button download-button"
                  onClick={() => descargarArchivo(urls['carnetoff.png'], 'carnet.pdf')}
                >
                  Descargar PDF
                </button>
              </div>
            </div>

            <div className="carnet-right glass-panel">
              <h2 className="section-title">Resumen del Usuario</h2>

              <div className="exam-row">
                <span>Examen A</span>
                <div
                  className="glass-grade green hover-scale"
                  onClick={() => descargarArchivo(urls['examen_a.pdf'], 'examen_a.pdf')}
                  style={{ cursor: 'pointer' }}
                >
                  {examenA}
                </div>
              </div>

              <div className="exam-row">
                <span>Examen B</span>
                <div
                  className="glass-grade green hover-scale"
                  onClick={() => descargarArchivo(urls['examen_b.pdf'], 'examen_b.pdf')}
                  style={{ cursor: 'pointer' }}
                >
                  {examenB}
                </div>
              </div>

              <div className="exam-row">
                <span>Nota Final</span>
                <div className="glass-grade green hover-scale">{notaFinal}</div>
              </div>

              <h3 className="section-subtitle">Contrato</h3>
              <div className="contract-status">
                <div className="glass-contract green">
                  Activo <div className="pulsating-circle inside"></div>
                </div>
              </div>
              <div className="contract-status">
                <div className="glass-contract red">Caducidad: {caducidad}</div>
              </div>
              <div className="contract-status">
                <div className="glass-contract yellow">
                  <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>HB: {hb}</span>
                </div>
              </div>

              <h3 className="section-subtitle">Categoría</h3>
              <div className="glass-category center-content">
                <img src={urls['ceo.png']} alt="CEO" className="ceo-img" />
                <strong>{categoria}</strong>
              </div>
            </div>
          </div>

          <div className="dual-insignias-container">
            <img src={urls['insigniasl.png']} alt="Izquierda" className="dual-insignias-img" />
            <img src={urls['insigniasr.png']} alt="Derecha" className="dual-insignias-img" />
          </div>
        </>
      )}

      <footer className="copyright-footer">
        © Nexus / Creator: Ocho - Renato V. 2025
      </footer>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="loading-text">Cargando carnet...</div>}>
      <CarnetContent />
    </Suspense>
  );
}














































































































































































