import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, LogOut, PackageSearch } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ui/use-toast';

const Navbar = ({ showFeatureToast }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Cierre de sesión exitoso", description: "¡Vuelve pronto!" });
      navigate('/');
    } catch (error) {
      toast({ title: "Error al cerrar sesión", description: error.message, variant: "destructive" });
    }
  };

  const navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Productos', path: '/products' },
    { label: 'Planes', path: '/pricing' },
    { label: 'Sobre Nosotros', path: '/about' },
    { label: 'Contacto', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MyResell</span>
            </Link>
          </motion.div>
          
          <div className="hidden md:flex space-x-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link 
                  to={item.path}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium" 
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            {user ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-white hover:text-purple-400" title="Dashboard">
                  <PackageSearch />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/profile')} className="text-white hover:text-purple-400" title="Perfil">
                  <User />
                </Button>
                <Button 
                  className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-xs px-3 py-1.5" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-1 h-3 w-3" /> Salir
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white text-xs px-3 py-1.5" onClick={() => navigate('/login')}>
                  Iniciar Sesión
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xs px-3 py-1.5" 
                  onClick={() => navigate('/register')}
                >
                  Registrarse
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;