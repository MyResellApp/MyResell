import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Send, Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulación de envío de formulario
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast({
      title: "Mensaje Enviado (Simulación)",
      description: "Gracias por contactarnos. Nos pondremos en contacto contigo pronto.",
    });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Send className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">Contáctanos</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            ¿Tienes preguntas o comentarios? Nos encantaría saber de ti. Completa el formulario o utiliza nuestros datos de contacto.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-effect p-8 rounded-xl"
          >
            <h2 className="text-3xl font-semibold mb-6 text-purple-300">Envíanos un Mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-gray-300">Nombre Completo</Label>
                <Input 
                  type="text" 
                  name="name" 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  className="mt-1 bg-slate-800 border-slate-700 focus:ring-purple-500 focus:border-purple-500" 
                  placeholder="Tu Nombre"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">Correo Electrónico</Label>
                <Input 
                  type="email" 
                  name="email" 
                  id="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  className="mt-1 bg-slate-800 border-slate-700 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-gray-300">Mensaje</Label>
                <textarea 
                  name="message" 
                  id="message" 
                  rows="4" 
                  value={formData.message}
                  onChange={handleChange}
                  required 
                  className="mt-1 w-full rounded-md bg-slate-800 border-slate-700 text-sm p-3 focus:ring-purple-500 focus:border-purple-500 placeholder:text-muted-foreground"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-3 neon-glow"
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-semibold mb-6 text-purple-300">Información de Contacto</h2>
            <div className="glass-effect p-6 rounded-xl flex items-start space-x-4">
              <Mail className="w-8 h-8 text-purple-400 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">Correo Electrónico</h3>
                <p className="text-gray-300">soporte@myresell.com</p>
                <p className="text-gray-400 text-sm">Respondemos en 24 horas</p>
              </div>
            </div>
            <div className="glass-effect p-6 rounded-xl flex items-start space-x-4">
              <Phone className="w-8 h-8 text-purple-400 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">Teléfono</h3>
                <p className="text-gray-300">+1 (555) 123-4567 (Simulado)</p>
                <p className="text-gray-400 text-sm">Lunes a Viernes, 9am - 5pm</p>
              </div>
            </div>
            <div className="glass-effect p-6 rounded-xl flex items-start space-x-4">
              <MapPin className="w-8 h-8 text-purple-400 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">Oficina (Virtual)</h3>
                <p className="text-gray-300">123 Calle Digital, Internet City</p>
                <p className="text-gray-400 text-sm">Operamos globalmente en línea</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;