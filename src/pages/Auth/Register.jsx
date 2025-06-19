import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Las contraseñas no coinciden.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await register(email, password, fullName);
      toast({ title: "Registro Exitoso", description: "¡Bienvenido a MyResell! Revisa tu email para confirmar tu cuenta." });
      navigate('/dashboard');
    } catch (error) {
      toast({ title: "Error de Registro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md glass-effect border-purple-500/30">
          <CardHeader className="text-center">
            <UserPlus className="w-12 h-12 mx-auto text-purple-400 mb-2" />
            <CardTitle className="text-3xl font-bold text-white">Crear Cuenta</CardTitle>
            <CardDescription className="text-gray-400">Únete a MyResell y empieza a crecer.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-gray-300">Nombre Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="mt-1 bg-slate-800 border-slate-700 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Tu Nombre Completo"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 bg-slate-800 border-slate-700 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="tu@email.com"
                />
              </div>
              <div className="relative">
                <Label htmlFor="password"className="text-gray-300">Contraseña</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                  className="mt-1 bg-slate-800 border-slate-700 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Mínimo 6 caracteres"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-purple-400">
                  {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
              <div className="relative">
                <Label htmlFor="confirmPassword"className="text-gray-300">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 bg-slate-800 border-slate-700 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Repite tu contraseña"
                />
                 <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-purple-400">
                  {showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-3" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarse'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center flex-col">
            <p className="text-sm text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-purple-400 hover:underline">
                Inicia Sesión
              </Link>
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Al registrarte, aceptas nuestros <Link to="/terms" className="underline hover:text-purple-400">Términos</Link> y <Link to="/privacy" className="underline hover:text-purple-400">Política de Privacidad</Link>.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;