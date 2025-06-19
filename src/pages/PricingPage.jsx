
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/context/UserContext';
import { useNavigate, Link } from 'react-router-dom'; // Importación añadida
import { useToast } from '@/components/ui/use-toast';

const PricingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, activeSubscription } = useUser();
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
        setPlans(data.map(plan => ({
          ...plan, 
          features: Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features || '[]'),
          stripe_price_id: plan.stripe_price_id // Asegúrate que este campo exista en tu tabla 'plans'
        })));
      }
      setLoading(false);
    };
    fetchPlans();
  }, [toast]);

  const handleSelectPlan = (plan) => {
    if (!user) {
      toast({ title: "Inicia Sesión", description: "Por favor, inicia sesión o regístrate para seleccionar un plan.", variant: "default" });
      navigate('/login', { state: { from: `/checkout/${plan.id}` } });
    } else if (activeSubscription && activeSubscription.plan_id === plan.id && activeSubscription.status === 'active') {
      toast({ title: "Plan Actual", description: `Ya estás suscrito al plan ${plan.name}.`, variant: "default" });
      navigate('/dashboard');
    }
     else if (!plan.stripe_price_id && plan.price > 0) { // Asumimos que los planes gratuitos no necesitan stripe_price_id
      toast({ title: "Plan no configurable", description: `El plan ${plan.name} no está listo para pagos. Contacta a soporte.`, variant: "destructive" });
    }
     else {
      navigate(`/checkout/${plan.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-128px)]">
        <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
      </div>
    );
  }
  
  const planColors = [
    "from-blue-500 to-purple-600",
    "from-purple-500 to-pink-600",
    "from-yellow-500 to-orange-600"
  ];


  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-4">Nuestros Planes de Suscripción</h1>
          <p className="text-xl text-gray-300">Elige el plan perfecto para impulsar tu negocio de reventa.</p>
        </motion.div>
        
        {plans.length === 0 && !loading && (
          <div className="text-center text-gray-400 text-lg glass-effect p-8 rounded-xl">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
            No hay planes disponibles en este momento. Por favor, vuelve más tarde.
          </div>
        )}

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.id} 
              className={`relative glass-effect rounded-2xl p-8 flex flex-col ${plan.name === 'Pro' ? 'ring-2 ring-purple-500 lg:scale-105' : ''}`} // Example: highlight Pro plan
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              {plan.name === 'Pro' && ( 
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center shadow-lg">
                    <Crown className="w-4 h-4 mr-1" />
                    Más Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8 flex-grow">
                <h2 className="text-3xl font-bold text-white mb-2">{plan.name}</h2>
                <p className="text-gray-400 mb-4 h-16 overflow-hidden text-sm">{plan.description}</p>
                <div className="flex items-baseline justify-center my-4">
                  <span className="text-5xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400 ml-2">/mes</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow text-sm">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full bg-gradient-to-r ${planColors[index % planColors.length]} hover:opacity-90 text-white font-semibold py-3 mt-auto text-base ${activeSubscription && activeSubscription.plan_id === plan.id && activeSubscription.status === 'active' ? 'opacity-70 cursor-default' : ''}`} 
                onClick={() => handleSelectPlan(plan)}
                disabled={activeSubscription && activeSubscription.plan_id === plan.id && activeSubscription.status === 'active'}
              >
                {activeSubscription && activeSubscription.plan_id === plan.id && activeSubscription.status === 'active' 
                  ? 'Plan Actual' 
                  : plan.name === 'Básico' && plan.price === 0 // Asumiendo que el plan básico es gratuito
                  ? 'Comenzar Gratis' 
                  : `Elegir Plan ${plan.name}`}
              </Button>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 text-center text-gray-400">
            <p>¿Necesitas un plan personalizado o tienes preguntas? <Link to="/contact" className="text-purple-400 hover:underline">Contáctanos</Link>.</p>
        </div>
      </div>
    </section>
  );
};

export default PricingPage;
