
import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Shirt, Sparkles } from 'lucide-react';

const CategoriesSection = ({ showFeatureToast }) => {
  const categories = [
    { name: "Electrónicos", icon: Smartphone, count: "150+ proveedores", description: "Smartphones, tablets, accesorios y más", image: "Modern electronics store with smartphones and gadgets" },
    { name: "Perfumes", icon: Sparkles, count: "80+ proveedores", description: "Fragancias originales y réplicas de calidad", image: "Luxury perfume bottles on elegant display" },
    { name: "Moda", icon: Shirt, count: "200+ proveedores", description: "Ropa, zapatos y accesorios de tendencia", image: "Fashion boutique with trendy clothes and accessories" },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">Categorías de Productos</h2>
          <p className="text-xl text-gray-300">Explora nuestra amplia gama de proveedores especializados</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div 
              key={category.name} 
              className="glass-effect rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer pulse-glow"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onClick={showFeatureToast}
            >
              <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 relative overflow-hidden">
                <img  className="w-full h-full object-cover opacity-80" alt={`${category.name} category`} src="" src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <category.icon className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-purple-400 font-semibold mb-2">{category.count}</p>
                <p className="text-gray-300">{category.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
