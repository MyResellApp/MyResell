
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, ShoppingBag, Settings, BarChart2, FileText } from 'lucide-react';
import { useUser } from '@/context/UserContext';

const AdminDashboard = () => {
  const { user } = useUser();

  const adminActions = [
    { title: "Gestionar Productos", path: "/admin/products", icon: ShoppingBag, description: "Añadir, editar o eliminar productos de la tienda y catálogo de proveedores." },
    { title: "Ver Pedidos", path: "/admin/orders", icon: FileText, description: "Revisar y actualizar el estado de los pedidos de los clientes." },
    { title: "Gestionar Usuarios", path: "/admin/users", icon: Users, description: "Ver lista de usuarios, sus suscripciones y roles." },
    // { title: "Analíticas", path: "/admin/analytics", icon: BarChart2, description: "Visualizar estadísticas de ventas, suscripciones y actividad." },
    { title: "Configuración General", path: "/admin/settings", icon: Settings, description: "Ajustes de la plataforma, planes y pasarelas de pago." },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-lg text-gray-400">Bienvenido, {user?.user_metadata?.full_name || user?.email}. Gestiona MyResell desde aquí.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link to={action.path}>
                <Card className="glass-effect h-full hover:shadow-purple-500/40 transition-all duration-300 hover:border-purple-500/70">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <action.icon className="w-10 h-10 text-purple-400" />
                    <CardTitle className="text-xl text-white">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Placeholder for quick stats or important notices */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-effect">
                <CardHeader>
                    <CardTitle className="text-lg text-purple-300">Resumen Rápido (Simulado)</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-1">
                    <p>Usuarios Activos: 125</p>
                    <p>Suscripciones Pro: 45</p>
                    <p>Ventas Hoy: $350.00</p>
                </CardContent>
            </Card>
            <Card className="glass-effect">
                <CardHeader>
                    <CardTitle className="text-lg text-purple-300">Notificaciones (Simulado)</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-1">
                    <p className="text-yellow-400">Actualización de Stripe API pendiente.</p>
                    <p>Nuevo producto popular: "Gadget X".</p>
                </CardContent>
            </Card>
        </div>

      </motion.div>
    </div>
  );
};

export default AdminDashboard;
