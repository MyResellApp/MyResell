
import React from 'react';
import { Navigate, Outlet, useLocation, Link as RouterLink } from 'react-router-dom'; // Changed Link to RouterLink
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion'; // Importación añadida
import { Button } from '@/components/ui/button'; // Import Button for the redirect

const AdminRoute = () => {
  const { user, loading: userLoading } = useUser();
  const [isAdmin, setIsAdmin] = React.useState(null); // null: loading, true: admin, false: not admin
  const [checkingAdmin, setCheckingAdmin] = React.useState(true);
  const location = useLocation();
  const { toast } = useToast();

  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('admin_users')
            .select('user_id')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (error) throw error;
          setIsAdmin(!!data); 

        } catch (err) {
          console.error("Error checking admin status:", err);
          toast({ title: "Error de Permisos", description: "No se pudo verificar el estado de administrador.", variant: "destructive" });
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false); 
      }
      setCheckingAdmin(false);
    };

    if (!userLoading) {
      checkAdminStatus();
    }
  }, [user, userLoading, toast]);

  if (userLoading || checkingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdmin === false) { 
    return (
       <div className="min-h-[calc(100vh-128px)] flex flex-col items-center justify-center text-center p-4 text-white bg-slate-900">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-effect p-10 md:p-16 rounded-2xl shadow-2xl shadow-red-500/30 max-w-md w-full"
        >
          <ShieldAlert className="w-24 h-24 text-red-400 mx-auto mb-8" />
          <h1 className="text-4xl font-extrabold mb-4 text-red-500">Acceso Denegado</h1>
          <p className="text-gray-300 mb-8 text-lg">
            No tienes permisos para acceder a esta sección.
          </p>
          <RouterLink to="/">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg">
              Volver al Inicio
            </Button>
          </RouterLink>
        </motion.div>
      </div>
    );
  }
  
  return <Outlet />;
};

export default AdminRoute;
