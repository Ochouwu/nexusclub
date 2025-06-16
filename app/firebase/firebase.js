// app/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDgie1UTf1qd2ji28on7srL4m-Rvu2h34c',
  authDomain: 'nexus-card-94728.firebaseapp.com',
  projectId: 'nexus-card-94728',
  storageBucket: 'nexus-card-94728.appspot.com', // CORREGIDO (usa .app**spot**.com)
  messagingSenderId: '710725249036',
  appId: '1:710725249036:web:96bd5a7d44cae7e546e629',
  measurementId: 'G-H8TKF916CJ'
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Función para obtener archivos del usuario
export async function getUserFiles(userId) {
  const fileNames = [
    'carnetoff.png',
    'ceo.png',
    'insigniasl.png',
    'insigniasr.png',
    'examen_a.pdf',
    'examen_b.pdf'
  ];

  const files = {};

  for (const name of fileNames) {
    const fileRef = ref(storage, `usuarios/${userId}/${name}`);
    try {
      const url = await getDownloadURL(fileRef);
      files[name] = url;
    } catch (error) {
      console.error(`❌ Error obteniendo ${name}:`, error);
      files[name] = ''; // Si no existe el archivo
    }
  }

  return files;
}

export { db, storage };

