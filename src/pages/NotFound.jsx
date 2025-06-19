import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-128px)] flex flex-col items-center justify-center text-center p-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="glass-effect p-10 md:p-16 rounded-2xl shadow-2xl shadow-purple-500/30 max-w-md w-full"
      >
        <AlertTriangle className="w-24 h-24 text-yellow-400 mx-auto mb-8 animate-bounce" />
        <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-3xl font-semibold mb-3">¡Ups! Página No Encontrada</h2>
        <p className="text-gray-300 mb-8 text-lg">
          Parece que te has perdido en el ciberespacio. La página que buscas no existe o ha sido movida.
        </p>
        <Link to="/">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-3 neon-glow"
          >
            Volver al Inicio
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;