import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const Success = () => {
  const location = useLocation();
  const { planName, subscriptionId } = location.state || { planName: 'seleccionado', subscriptionId: 'N/A' };

  return (
    <div className="min-h-[calc(100vh-128px)] flex flex-col items-center justify-center p-4 text-white text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
        className="glass-effect p-8 md:p-12 rounded-xl shadow-2xl shadow-green-500/30 max-w-lg w-full"
      >
        <CheckCircle2 className="w-24 h-24 text-green-400 mx-auto mb-6 animate-pulse" />
        <h1 className="text-4xl font-bold mb-4">¡Suscripción Exitosa!</h1>
        <p className="text-xl text-gray-300 mb-2">
          Felicidades, te has suscrito correctamente al plan <span className="font-semibold text-purple-300">{planName}</span>.
        </p>
        <p className="text-gray-400 mb-8 text-sm">
          ID de Suscripción (simulado): {subscriptionId}
        </p>
        <p className="text-gray-300 mb-8">
          Ya puedes disfrutar de todos los beneficios de tu nuevo plan. ¡Explora la plataforma y lleva tu negocio al siguiente nivel!
        </p>
        <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
          <Link to="/dashboard">
            <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 neon-glow">
              Ir al Dashboard
            </Button>
          </Link>
          <Link to="/pricing">
            <Button size="lg" variant="outline" className="w-full md:w-auto border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
              Ver Otros Planes
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;