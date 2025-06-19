import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Re-using existing component, adapted for direct use or within Home page
const PricingSection = ({ showFeatureToast, isPage = false }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('plans').select('*').order('price', { ascending: true });
      if (error) {
        console.error('Error fetching plans:', error);
        toast({ title: "Error", description: "No se pudieron cargar los planes.", variant: "destructive" });
      } else {
        setPlans(data.map(plan => ({...plan, features: Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features || '[]')})));
      }
      setLoading(false);
    };
    fetchPlans();
  }, [toast]);

  const handleSelectPlan = (planId) => {
    if (showFeatureToast && typeof showFeatureToast === 'function' && !isPage) {
        showFeatureToast(planId); // This will navigate to /pricing if on Home
        return;
    }

    if (!user) {
      toast({ title: "Inicia Sesión", description: "Por favor, inicia sesión o regístrate para seleccionar un plan.", variant: "default" });
      navigate('/login', { state: { from: `/checkout/${planId}` } });
    } else {
      navigate(`/checkout/${planId}`);
    }
  };
  
  const planColors = [
    "from-blue-500 to-purple-600",
    "from-purple-500 to-pink-600",
    "from-yellow-500 to-orange-600"
  ];

  if (loading && isPage) { // Only show full page loader if it's the dedicated pricing page
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-128px)]">
        <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
      </div>
    );
  }
  
  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${isPage ? 'text-white' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`text-4xl font-bold mb-4 ${isPage ? 'text-white' : 'text-white'}`}>
            {isPage ? "Nuestros Planes de Suscripción" : "Planes de Suscripción"}
          </h2>
          <p className={`text-xl ${isPage ? 'text-gray-300' : 'text-gray-300'}`}>
            {isPage ? "Elige el plan perfecto para impulsar tu negocio de reventa." : "Elige el plan perfecto para hacer crecer tu negocio"}
          </p>
        </motion.div>
        
        {plans.length === 0 && loading && !isPage && ( /* Show inline loader for Home section */
            <div className="flex justify-center items-center h-64">
                 <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
            </div>
        )}

        {plans.length === 0 && !loading && (
          <div className={`text-center ${isPage ? 'text-gray-400' : 'text-gray-400'} text-lg`}>No hay planes disponibles en este momento.</div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.id} 
              className={`relative glass-effect rounded-2xl p-8 flex flex-col ${index === 1 ? 'ring-2 ring-purple-500 scale-105' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {index === 1 && ( 
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    Más Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8 flex-grow">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-4 h-12 overflow-hidden">{plan.description}</p>
                <div className="flex items-baseline justify-center my-4">
                  <span className="text-5xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400 ml-2">/mes</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                 {(plan.features || []).map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full bg-gradient-to-r ${planColors[index % planColors.length]} hover:opacity-90 text-white font-semibold py-3 mt-auto`} 
                onClick={() => handleSelectPlan(plan.id)}
              >
                {index === 1 ? 'Comenzar Prueba Gratis' : 'Seleccionar Plan'}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;