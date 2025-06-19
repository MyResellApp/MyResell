import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

const Cancel = () => {
  const location = useLocation();
  const { planName, error } = location.state || { planName: 'seleccionado', error: 'Un error desconocido ocurrió.' };

  return (
    <div className="min-h-[calc(100vh-128px)] flex flex-col items-center justify-center p-4 text-white text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect p-8 md:p-12 rounded-xl shadow-2xl shadow-red-500/30 max-w-lg w-full"
      >
        <XCircle className="w-24 h-24 text-red-400 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Pago Cancelado o Fallido</h1>
        <p className="text-xl text-gray-300 mb-2">
          Lo sentimos, hubo un problema al procesar tu suscripción al plan <span className="font-semibold text-purple-300">{planName}</span>.
        </p>
        {error && (
          <p className="text-red-400 bg-red-900/30 p-3 rounded-md text-sm mb-6">
            Detalles del error: {error}
          </p>
        )}
        <p className="text-gray-300 mb-8">
          No se realizó ningún cargo. Por favor, intenta de nuevo o contacta a soporte si el problema persiste.
        </p>
        <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
          <Link to="/pricing">
            <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 neon-glow">
              Intentar de Nuevo
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="w-full md:w-auto border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
              Contactar Soporte
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Cancel;