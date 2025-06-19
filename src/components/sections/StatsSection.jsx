
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Star, Clock } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    { number: "500+", label: "Proveedores Verificados", icon: Shield },
    { number: "10K+", label: "Revendedores Activos", icon: Users },
    { number: "98%", label: "Satisfacción Cliente", icon: Star },
    { number: "24/7", label: "Soporte Disponible", icon: Clock },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label} 
              className="text-center glass-effect rounded-xl p-6 floating" 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
