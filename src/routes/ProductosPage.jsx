import React from 'react';
import Productos from '@/components/Productos';

export default function ProductosPage() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Catálogo de productos</h1>
      <Productos />
    </div>
  );
}
