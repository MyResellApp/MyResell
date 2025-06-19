import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';

function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    async function fetchProductos() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Error al obtener productos:', error);
      else setProductos(data);
    }

    fetchProductos();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {productos.map((p) => (
        <div key={p.id} className="border p-4 rounded shadow">
          <h2 className="text-xl font-bold">{p.name}</h2>
          <p className="text-gray-600 mb-2">{p.description}</p>
          <p className="font-semibold">{(p.price / 100).toFixed(2)} €</p>
          <button className="mt-2 bg-black text-white px-4 py-1 rounded">Comprar</button>
        </div>
      ))}
    </div>
  );
}

export default Productos;
