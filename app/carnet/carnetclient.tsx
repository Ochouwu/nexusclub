'use client';
import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import '../../style.css';
import { getUserFiles } from '../firebase/firebase';

export default function CarnetClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || 'SIN-ID';

  const [files, setFiles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchFiles = async () => {
      const data = await getUserFiles(id);
      setFiles(data);
    };
    fetchFiles();
  }, [id]);

  const handleDownload = (fileKey: string, fileName: string) => {
    const url = files[fileKey];
    if (!url) return alert('❌ Archivo no disponible');
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = async () => {
    const imageUrl = files['carnetoff.png'];
    if (!imageUrl) return alert('❌ Imagen del carnet no disponible');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      const pdf = new jsPDF();
      const imgWidth = 190;
      const imgHeight = (img.height * imgWidth) / img.width;
      pdf.addImage(img, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('carnet.pdf');
    };
    img.onerror = () => {
      alert('❌ No se pudo cargar la imagen para generar el PDF');
    };
  };

  return (
    <main className="main-container">
      <video autoPlay loop muted className="background-video">
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div className="content fade-in">
        <h1 className="title">Carnet</h1>
        <Image
          src={files['carnetoff.png'] || '/carnet.png'}
          alt="Carnet"
          width={600}
          height={400}
          priority
        />
        <p className="id-display">ID: {id}</p>

        <div className="button-group">
          <button onClick={() => handleDownload('carnetoff.png', 'carnet.png')}>
            Descargar imagen
          </button>
          <button onClick={handleDownloadPDF}>
            Descargar PDF
          </button>
          <button onClick={() => handleDownload('examen_a.pdf', 'examenA.pdf')}>
            Examen A
          </button>
          <button onClick={() => handleDownload('examen_b.pdf', 'examenB.pdf')}>
            Examen B
          </button>
        </div>
      </div>
    </main>
  );
}



