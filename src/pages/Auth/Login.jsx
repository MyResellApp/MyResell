import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast({ title: "Inicio de Sesión Exitoso", description: "¡Bienvenido de nuevo!" });
      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      toast({ title: "Error de Inicio de Sesión", description: error.message, variant: "destructive" });
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
            <LogIn className="w-12 h-12 mx-auto text-purple-400 mb-2" />
            <CardTitle className="text-3xl font-bold text-white">Iniciar Sesión</CardTitle>
            <CardDescription className="text-gray-400">Accede a tu cuenta MyResell.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="password" className="text-gray-300">Contraseña</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 bg-slate-800 border-slate-700 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Tu contraseña"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-purple-400">
                  {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
              <div className="flex items-center justify-between">
                {/* <div className="flex items-center">
                  <Checkbox id="remember-me" className="border-gray-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"/>
                  <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-400">Recuérdame</Label>
                </div> */}
                {/* Functionality to be added if requested */}
                <Link to="#" onClick={() => toast({title: "Función no implementada"})} className="text-sm text-purple-400 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-3" disabled={loading}>
                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center flex-col">
            <p className="text-sm text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="font-medium text-purple-400 hover:underline">
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;