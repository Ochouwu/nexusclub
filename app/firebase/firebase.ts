// app/firebase/firebase.ts

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDgie1UTf1qd2ji28on7srL4m-Rvu2h34c',
  authDomain: 'nexus-card-94728.firebaseapp.com',
  projectId: 'nexus-card-94728',
  storageBucket: 'nexus-card-94728.appspot.com', // ✅ ¡DEBE SER appspot.com!
  messagingSenderId: '710725249036',
  appId: '1:710725249036:web:96bd5a7d44cae7e546e629',
  measurementId: 'G-H8TKF916CJ'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ Obtener archivos por ID de usuario
export const getUserFiles = async (userId: string) => {
  const fileNames = [
    'carnetoff.png',
    'ceo.png',
    'insigniasl.png',
    'insigniasr.png',
    'examen_a.pdf',
    'examen_b.pdf'
  ];

  const files: { [key: string]: string } = {};

  for (const name of fileNames) {
    const fileRef = ref(storage, `usuarios/${userId}/${name}`);
    try {
      const url = await getDownloadURL(fileRef);
      files[name] = url;
    } catch (error) {
      console.error(`❌ Error obteniendo ${name}:`, error);
      files[name] = '';
    }
  }

  return files;
};





