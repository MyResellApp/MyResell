
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, Users } from 'lucide-react';

const CommunitySection = ({ showFeatureToast }) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass-effect rounded-3xl p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Únete a la Comunidad Premium</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Accede a contenido exclusivo, nuevos proveedores cada semana, 
              y conecta con otros revendedores exitosos en nuestra comunidad premium.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-lg px-8 py-6" 
                onClick={showFeatureToast}
              >
                <Users className="mr-2 w-5 h-5" />
                Explorar Comunidad
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white text-lg px-8 py-6" 
                onClick={showFeatureToast}
              >
                Ver Beneficios
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
