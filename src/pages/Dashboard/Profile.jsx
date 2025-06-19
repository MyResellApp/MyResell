import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { UserCircle, Mail, Edit3, Save, Shield } from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile, loading: userLoading } = useUser();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updates = {};
      if (fullName !== user.user_metadata?.full_name) {
        updates.data = { ...updates.data, full_name: fullName };
      }
      if (email !== user.email) {
        updates.email = email; // Note: Email change might require confirmation
      }

      if (Object.keys(updates).length === 0) {
        toast({ title: "Sin cambios", description: "No se detectaron cambios en el perfil." });
        setIsEditingProfile(false);
        return;
      }

      await updateUserProfile(updates);
      toast({ title: "Perfil Actualizado", description: "Tu información de perfil ha sido actualizada." });
      setIsEditingProfile(false);
    } catch (error) {
      toast({ title: "Error al Actualizar Perfil", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ title: "Contraseña Corta", description: "La nueva contraseña debe tener al menos 6 caracteres.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Error", description: "Las nuevas contraseñas no coinciden.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await updateUserProfile({ password: newPassword });
      toast({ title: "Contraseña Actualizada", description: "Tu contraseña ha sido cambiada exitosamente." });
      setNewPassword('');
      setConfirmNewPassword('');
      setIsEditingPassword(false);
    } catch (error) {
      toast({ title: "Error al Actualizar Contraseña", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (userLoading || !user) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-128px)] text-white">Cargando perfil...</div>;
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 text-white">
      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <UserCircle className="w-24 h-24 mx-auto text-purple-400 mb-4" />
          <h1 className="text-4xl font-bold">Tu Perfil</h1>
          <p className="text-lg text-gray-400">Gestiona tu información personal y seguridad.</p>
        </div>

        {/* Profile Information Card */}
        <Card className="mb-8 glass-effect border-purple-500/30">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-2xl text-white">Información Personal</CardTitle>
              <CardDescription className="text-gray-400">Actualiza tus datos personales.</CardDescription>
            </div>
            {!isEditingProfile && (
              <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)} className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
                <Edit3 className="mr-2 h-4 w-4" /> Editar
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-gray-300 flex items-center"><UserCircle className="mr-2 h-4 w-4"/>Nombre Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditingProfile || isLoading}
                  className="mt-1 bg-slate-800 border-slate-700 read-only:opacity-70 read-only:cursor-not-allowed focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Tu Nombre Completo"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300 flex items-center"><Mail className="mr-2 h-4 w-4"/>Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditingProfile || isLoading} // Email change is complex, may need verification step. For now, make it editable with caution.
                  className="mt-1 bg-slate-800 border-slate-700 read-only:opacity-70 read-only:cursor-not-allowed focus:ring-purple-500 focus:border-purple-500"
                  placeholder="tu@email.com"
                />
              </div>
              {isEditingProfile && (
                <div className="flex justify-end space-x-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => { setIsEditingProfile(false); setFullName(user.user_metadata?.full_name || ''); setEmail(user.email || ''); }} disabled={isLoading} className="text-gray-400 hover:text-white">
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" /> {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Password Change Card */}
        <Card className="glass-effect border-purple-500/30">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-2xl text-white">Cambiar Contraseña</CardTitle>
              <CardDescription className="text-gray-400">Actualiza tu contraseña de acceso.</CardDescription>
            </div>
            {!isEditingPassword && (
               <Button variant="outline" size="sm" onClick={() => setIsEditingPassword(true)} className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
                <Shield className="mr-2 h-4 w-4" /> Cambiar
              </Button>
            )}
          </CardHeader>
          {isEditingPassword && (
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="newPassword"className="text-gray-300">Nueva Contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    minLength="6"
                    className="mt-1 bg-slate-800 border-slate-700 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmNewPassword"className="text-gray-300">Confirmar Nueva Contraseña</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="mt-1 bg-slate-800 border-slate-700 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Repite la nueva contraseña"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => {setIsEditingPassword(false); setNewPassword(''); setConfirmNewPassword('');}} disabled={isLoading} className="text-gray-400 hover:text-white">
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" /> {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>

      </motion.div>
    </div>
  );
};

export default Profile;