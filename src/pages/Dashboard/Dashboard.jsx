import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Package, Users, BarChart3, Settings, Star, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { user, activeSubscription } = useUser();
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const quickActions = [
    { title: "Explorar Proveedores", icon: Package, action: () => navigate('/dashboard/suppliers'), disabled: !activeSubscription || activeSubscription.status !== 'active' },
    { title: "Gestionar Suscripción", icon: Star, action: () => navigate('/pricing') },
    { title: "Ver Estadísticas", icon: BarChart3, action: () => navigate('/dashboard/stats'), disabled: true },
    { title: "Comunidad Premium", icon: Users, action: () => navigate('/dashboard/community'), disabled: activeSubscription?.plans?.name !== 'Premium' },
    { title: "Configuración de Cuenta", icon: Settings, action: () => navigate('/dashboard/profile') },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 text-white">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Bienvenido, {user?.user_metadata?.full_name || user?.email}!</h1>
          <p className="text-lg text-gray-400">Aquí tienes un resumen de tu actividad en MyResell.</p>
        </div>

        {!activeSubscription || activeSubscription.status !== 'active' ? (
          <motion.div 
            variants={cardVariants} 
            initial="hidden" 
            animate="visible"
            className="mb-8 bg-yellow-500/10 border border-yellow-500 text-yellow-300 p-6 rounded-xl flex items-center space-x-4"
          >
            <AlertTriangle className="h-8 w-8 text-yellow-400" />
            <div>
              <h2 className="text-xl font-semibold">No tienes una suscripción activa.</h2>
              <p className="text-sm">Para acceder a todas las funciones de MyResell, por favor elige un plan.</p>
              <Button onClick={() => navigate('/pricing')} className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-black">
                Ver Planes
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            variants={cardVariants} 
            initial="hidden" 
            animate="visible"
            className="mb-8"
          >
            <Card className="glass-effect border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-300 flex items-center">
                  <Star className="mr-2 text-yellow-400" /> Tu Plan Actual: {activeSubscription.plans.name}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {activeSubscription.plans.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Estado: <span className="font-semibold text-green-400 capitalize">{activeSubscription.status}</span></p>
                <p className="text-gray-300">Válido hasta: {activeSubscription.end_date ? new Date(activeSubscription.end_date).toLocaleDateString() : 'Indefinido'}</p>
                <Button onClick={() => navigate('/pricing')} variant="outline" className="mt-4 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
                  Gestionar Suscripción
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="mb-10">
          <h2 className="text-3xl font-semibold mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div key={index} variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 * index }}>
                <Card className={`glass-effect hover:border-purple-500/70 transition-all duration-300 h-full flex flex-col ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <CardHeader className="flex-row items-center space-x-4">
                    <action.icon className="w-8 h-8 text-purple-400" />
                    <CardTitle className="text-xl text-white">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {/* Placeholder for short description or stats related to the action */}
                  </CardContent>
                  <div className="p-6 pt-0">
                  <Button 
                    onClick={action.action} 
                    className="w-full bg-slate-700 hover:bg-slate-600"
                    disabled={action.disabled}
                  >
                    {action.disabled && activeSubscription?.plans?.name !== 'Premium' && action.title === "Comunidad Premium" ? "Requiere Plan Premium" : action.disabled ? "No disponible" : "Acceder"}
                  </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Placeholder for more dashboard widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-xl text-white">Actividad Reciente (Simulado)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-400 space-y-2">
                  <li>- Nuevo proveedor de electrónicos agregado.</li>
                  <li>- Actualización de precios en la categoría Moda.</li>
                  <li>- Artículo de blog: "Cómo escalar tu negocio de reventa".</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.7 }}>
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-xl text-white">Consejo del Día (Simulado)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">"Diversifica tus fuentes de proveedores para mitigar riesgos y encontrar mejores ofertas."</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
};

export default Dashboard;