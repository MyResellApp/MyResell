
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Users, AlertTriangle, ShieldCheck, ShieldOff, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    // Fetch users from auth.users and their admin status from admin_users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      toast({ title: "Error", description: "No se pudieron cargar los usuarios.", variant: "destructive" });
      console.error("Error fetching auth users:", authError);
      setLoading(false);
      return;
    }

    // Fetch admin statuses
    const { data: adminData, error: adminError } = await supabase.from('admin_users').select('user_id');
    if (adminError) {
      console.warn("Error fetching admin statuses:", adminError);
    }
    const adminIds = new Set(adminData?.map(a => a.user_id) || []);

    const combinedUsers = authUsers.users.map(u => ({
      ...u,
      is_admin_role: adminIds.has(u.id),
    }));
    
    setUsers(combinedUsers);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAdminStatus = async (userId, currentIsAdmin) => {
    setLoading(true);
    let error;
    if (currentIsAdmin) {
      // Revoke admin
      const { error: deleteError } = await supabase.from('admin_users').delete().eq('user_id', userId);
      error = deleteError;
    } else {
      // Grant admin
      const { error: insertError } = await supabase.from('admin_users').insert({ user_id: userId });
      error = insertError;
    }

    if (error) {
      toast({ title: "Error", description: `Error al cambiar estado de admin: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Éxito", description: `Estado de admin ${currentIsAdmin ? 'revocado' : 'concedido'}.` });
      fetchUsers(); // Refresh list
    }
    // setLoading(false); // fetchUsers will set it
  };
  
  const handleUserAction = (action, userId) => {
    // Placeholder for other actions like "Ver Suscripciones", "Banear Usuario"
    toast({ title: "Acción no implementada", description: `La acción "${action}" para el usuario ${userId.substring(0,8)}... no está implementada aún.`});
  };


  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gestionar Usuarios</h1>

        {loading && users.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          </div>
        ) : !loading && users.length === 0 ? (
          <div className="text-center py-12 glass-effect rounded-lg">
            <Users className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <p className="text-xl text-gray-400">No hay usuarios para mostrar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto glass-effect rounded-lg p-0.5">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre Completo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Registrado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rol Admin</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-slate-800/30 divide-y divide-slate-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.user_metadata?.full_name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.is_admin_role ? (
                        <ShieldCheck className="h-5 w-5 text-green-400" title="Administrador" />
                      ) : (
                        <ShieldOff className="h-5 w-5 text-gray-500" title="Usuario Regular" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-purple-300">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-700 text-white border-slate-600">
                          <DropdownMenuItem onClick={() => toggleAdminStatus(user.id, user.is_admin_role)} className="hover:!bg-purple-600/50 focus:!bg-purple-600/50">
                            {user.is_admin_role ? 'Revocar Admin' : 'Conceder Admin'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction('Ver Suscripciones', user.id)} className="hover:!bg-purple-600/50 focus:!bg-purple-600/50">Ver Suscripciones</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction('Banear Usuario', user.id)} className="text-red-400 hover:!bg-red-600/50 focus:!bg-red-600/50 hover:!text-white">Banear Usuario</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
