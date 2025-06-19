import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MyResell</span>
            </Link>
            <p className="text-gray-400 text-sm">
              La plataforma líder para revendedores que buscan los mejores proveedores.
            </p>
          </div>
          
          <div>
            <span className="text-white font-semibold mb-4 block">Navegación</span>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Productos</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Planes</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>
          
          <div>
            <span className="text-white font-semibold mb-4 block">Categorías Populares</span>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/products?category=Electrónica" className="hover:text-white transition-colors">Electrónicos</Link></li>
              <li><Link to="/products?category=Moda" className="hover:text-white transition-colors">Moda</Link></li>
              <li><Link to="/products?category=Perfumes" className="hover:text-white transition-colors">Perfumes</Link></li>
              <li><span className="hover:text-white transition-colors cursor-not-allowed opacity-50">Hogar (Próximamente)</span></li>
            </ul>
          </div>
          
          <div>
            <span className="text-white font-semibold mb-4 block">Legal</span>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/terms" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
              <li><span className="hover:text-white transition-colors cursor-not-allowed opacity-50">Política de Cookies</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} MyResell. Todos los derechos reservados.</p>
          <p>Una creación de Horizons AI para Hostinger.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;