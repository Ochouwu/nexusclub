'use client';
import { Suspense } from 'react';
import CarnetInner from './CarnetInner';

export default function CarnetPage() {
  return (
    <Suspense fallback={<div className="loading-text">Cargando carnet...</div>}>
      <CarnetInner />
    </Suspense>
  );
}








