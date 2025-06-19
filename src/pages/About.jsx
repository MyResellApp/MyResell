import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <ShoppingBag className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">Sobre MyResell</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Conectamos a revendedores ambiciosos con una red de proveedores confiables, simplificando el camino hacia el éxito en el comercio electrónico.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-12 mb-16 items-center"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
            <img  
              className="rounded-xl shadow-2xl w-full h-auto object-cover neon-glow"
              alt="Equipo de MyResell trabajando en un entorno moderno" src="https://images.unsplash.com/photo-1634715022648-13d43a4e9fe8" />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}>
            <h2 className="text-3xl font-semibold mb-4 text-purple-300">Nuestra Misión</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              En MyResell, nuestra misión es empoderar a emprendedores y revendedores proporcionándoles las herramientas, recursos y conexiones necesarias para prosperar en el competitivo mercado actual. Creemos en la transparencia, la calidad y el crecimiento mutuo.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Facilitamos el acceso a una amplia gama de productos de alta demanda, desde electrónicos de última generación hasta perfumes exclusivos y tendencias de moda, todo a través de una plataforma intuitiva y segura.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-10 text-purple-300">¿Por Qué Elegir MyResell?</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Comunidad Fuerte", description: "Únete a una red de revendedores y proveedores, comparte conocimientos y crece." },
              { icon: Target, title: "Proveedores Verificados", description: "Accede solo a proveedores de confianza que cumplen nuestros estándares de calidad." },
              { icon: Zap, title: "Herramientas Innovadoras", description: "Utiliza nuestra plataforma para gestionar tus pedidos y descubrir nuevas oportunidades." },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="glass-effect p-6 rounded-xl text-center hover:shadow-purple-500/50 transition-shadow duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <item.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4">¿Listo para Empezar?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Únete a MyResell hoy mismo y lleva tu negocio de reventa al siguiente nivel.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-3 neon-glow">
              Crear Cuenta Gratis
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default About;