import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, ShoppingCart, CreditCard, ShieldCheck, Banknote, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadStripe } from '@stripe/stripe-js';

// TODO: Reemplaza con tu Publishable Key de Stripe REAL (Live)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user, fetchUserSubscription } = useUser();
  const { toast } = useToast();
  const [plan, setPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe');

  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (!planId) {
        toast({ title: "Error", description: "ID de plan no especificado.", variant: "destructive" });
        navigate('/pricing');
        return;
      }
      setLoadingPlan(true);
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error || !data) {
        toast({ title: "Error", description: "No se pudo cargar el plan seleccionado.", variant: "destructive" });
        console.error('Error fetching plan:', error);
        navigate('/pricing');
      } else {
        setPlan({...data, features: Array.isArray(data.features) ? data.features : JSON.parse(data.features || '[]'), stripe_price_id: data.stripe_price_id });
      }
      setLoadingPlan(false);
    };

    fetchPlanDetails();
  }, [planId, navigate, toast]);

  const handleStripePayment = async () => {
    if (!user || !plan || !plan.stripe_price_id) {
      toast({ title: "Error de Configuración", description: "Falta información del usuario, del plan o el ID de precio de Stripe no está configurado para este plan.", variant: "destructive" });
      setProcessingPayment(false);
      return;
    }
    if (STRIPE_PUBLISHABLE_KEY === "pk_live_YOUR_REAL_STRIPE_PUBLISHABLE_KEY" || STRIPE_PUBLISHABLE_KEY.includes("pk_test_")) {
        toast({ title: "Configuración Requerida", description: "Por favor, configura tu Stripe Publishable Key (Live) en el código.", variant: "destructive", duration: 7000 });
        setProcessingPayment(false);
        return;
    }
    setProcessingPayment(true);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        toast({ title: "Error de Stripe", description: "No se pudo cargar Stripe.", variant: "destructive" });
        setProcessingPayment(false);
        return;
      }
      
      toast({ title: "Iniciando Pago Seguro", description: "Redirigiendo a Stripe...", duration: 3000});

      const { data: checkoutSession, error: sessionError } = await supabase.functions.invoke('create-stripe-checkout-session', {
        body: { 
          priceId: plan.stripe_price_id,
          userId: user.id,
          userEmail: user.email,
          planId: plan.id,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        }
      });

      if (sessionError || !checkoutSession || !checkoutSession.id) {
        console.error('Error creating Stripe Checkout session:', sessionError, checkoutSession);
        let errorMessage = "No se pudo iniciar el pago con Stripe.";
        if (sessionError) {
            errorMessage = sessionError.message.includes("Function not found") 
                ? "La función 'create-stripe-checkout-session' no se encuentra en Supabase. Por favor, créala."
                : sessionError.message;
        } else if (!checkoutSession || !checkoutSession.id) {
            errorMessage = "La respuesta de la función 'create-stripe-checkout-session' no fue la esperada (falta ID de sesión)."
        }
        toast({ title: "Error de Pago", description: errorMessage, variant: "destructive", duration: 10000 });
        setProcessingPayment(false);
        return;
      }
      
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: checkoutSession.id,
      });

      if (stripeError) {
        console.error("Stripe redirectToCheckout error:", stripeError);
        toast({ title: "Error de Redirección", description: stripeError.message, variant: "destructive" });
        setProcessingPayment(false);
      }
      // Si la redirección es exitosa, el usuario no verá nada más aquí.
      // Si falla la redirección, el toast anterior se mostrará.
      // El procesamiento de la suscripción se hará mediante webhooks de Stripe.

    } catch (error) {
      console.error('Error en el proceso de pago con Stripe:', error);
      toast({ title: "Error Inesperado", description: `Ocurrió un error: ${error.message}`, variant: "destructive" });
      setProcessingPayment(false);
    }
  };
  
  const handlePayPalPayment = async () => {
    // PayPal sigue siendo simulado, ya que la integración real es compleja y requiere backend/edge functions específicas.
    if (!user || !plan) return;
    setProcessingPayment(true);
    toast({ title: "PayPal (Simulado)", description: "Procesando con PayPal... Esta integración es una simulación. La funcionalidad real requiere configuración avanzada.", duration: 7000 });
    
    // Simulación de la creación de la suscripción y el pago
    await new Promise(resolve => setTimeout(resolve, 3000));
    const simulatedSuccess = Math.random() > 0.3; // 70% de éxito simulado
    if (simulatedSuccess) {
      // En una implementación real, esta lógica estaría en un webhook/callback de PayPal
      try {
        await createSubscriptionRecord(`paypal_sim_${Date.now()}`, 'paypal');
      } catch (e) { /* error handled in createSubscriptionRecord */ }
    } else {
      navigate('/payment/cancel', { state: { planName: plan.name, error: "Simulación de pago fallido con PayPal." } });
    }
    setProcessingPayment(false);
  };

  const handleBankTransfer = async () => {
    // Transferencia bancaria sigue siendo simulada y manual.
    if (!user || !plan) return;
    setProcessingPayment(true);
    toast({ title: "Transferencia Bancaria (Proceso Manual)", description: "Sigue las instrucciones. La activación es manual tras confirmar el pago.", duration: 10000 });
    
    // Simulación de la creación de la suscripción y el pago (como si se confirmara manualmente)
    await new Promise(resolve => setTimeout(resolve, 3000));
    try {
      await createSubscriptionRecord(`transfer_manual_${Date.now()}`, 'transfer');
    } catch (e) { /* error handled in createSubscriptionRecord */ }
    setProcessingPayment(false);
  };

  // Esta función es para simulación de PayPal y Transferencia, o si el webhook de Stripe fallara como último recurso.
  // En producción, Stripe debería manejar esto vía webhooks.
  const createSubscriptionRecord = async (transactionId, paymentMethod) => {
    try {
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ status: 'inactive', end_date: new Date().toISOString() })
        .match({ user_id: user.id, status: 'active' });
      if (updateError) console.warn('Warning deactivating old subscriptions:', updateError.message);

      const { data: newSubscription, error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          status: 'active', 
          stripe_subscription_id: transactionId,
          end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        })
        .select()
        .single();
      if (insertError) throw insertError;

      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          subscription_id: newSubscription.id,
          plan_id: plan.id,
          amount: plan.price,
          currency: plan.currency || 'usd',
          payment_method: paymentMethod,
          transaction_id: transactionId,
          status: 'succeeded',
          payment_intent_id: paymentMethod === 'stripe' ? transactionId : null,
        });
      if (paymentError) console.warn('Warning saving payment record:', paymentError.message);
      
      await fetchUserSubscription(user.id); 
      toast({ title: "¡Suscripción Registrada!", description: `Te has suscrito al plan ${plan.name}.`, duration: 5000 });
      navigate('/payment/success', { state: { planName: plan.name, subscriptionId: newSubscription.id } });

    } catch (error) {
      console.error('Error creating subscription/payment record (simulated):', error);
      toast({ title: "Error de Sistema (Simulado)", description: `Hubo un problema al registrar tu suscripción: ${error.message}`, variant: "destructive", duration: 7000 });
      navigate('/payment/cancel', { state: { planName: plan.name, error: `Error al registrar suscripción (simulado): ${error.message}` } });
      throw error; // Re-throw para que el llamador sepa que falló
    }
  };


  const paymentActions = {
    stripe: handleStripePayment,
    paypal: handlePayPalPayment,
    transfer: handleBankTransfer,
  };

  if (loadingPlan) {
    return (
      <div className="min-h-[calc(100vh-128px)] flex items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-[calc(100vh-128px)] flex flex-col items-center justify-center text-white p-4 text-center">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Plan no encontrado</h1>
        <p className="text-gray-400 mb-6">No pudimos encontrar los detalles del plan seleccionado.</p>
        <Button onClick={() => navigate('/pricing')} className="bg-gradient-to-r from-purple-500 to-pink-500">Volver a Planes</Button>
      </div>
    );
  }
  
  const paymentMethodDetails = {
    stripe: { icon: CreditCard, label: "Stripe", buttonText: "Pagar con Stripe", color: "from-indigo-500 to-purple-600" },
    paypal: { icon: ShieldCheck, label: "PayPal", buttonText: "Pagar con PayPal (Simulado)", color: "from-blue-500 to-sky-600" },
    transfer: { icon: Banknote, label: "Transferencia Bancaria", buttonText: "Confirmar Transferencia (Manual)", color: "from-gray-500 to-slate-600" },
  };
  
  const CurrentPaymentIcon = paymentMethodDetails[selectedPaymentMethod].icon;

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-4 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <Card className="glass-effect border-purple-500/50 shadow-2xl shadow-purple-500/20">
          <CardHeader className="text-center">
            <ShoppingCart className="w-12 h-12 mx-auto text-purple-400 mb-3" />
            <CardTitle className="text-3xl font-bold">Confirmar Suscripción</CardTitle>
            <CardDescription className="text-gray-300">Estás a punto de suscribirte al plan <span className="font-semibold text-purple-300">{plan.name}</span>.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Detalles del Plan:</h3>
              <ul className="space-y-1 text-gray-300">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-slate-700 pt-4">
              <div className="flex justify-between items-center text-2xl font-bold text-white">
                <span>Total a Pagar:</span>
                <span>${plan.price}<span className="text-sm font-normal text-gray-400">/mes</span></span>
              </div>
            </div>
            
            <Tabs value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 p-1 h-auto">
                <TabsTrigger value="stripe" className="data-[state=active]:bg-indigo-500/80 data-[state=active]:text-white text-xs sm:text-sm py-2">Stripe</TabsTrigger>
                <TabsTrigger value="paypal" className="data-[state=active]:bg-blue-500/80 data-[state=active]:text-white text-xs sm:text-sm py-2">PayPal</TabsTrigger>
                <TabsTrigger value="transfer" className="data-[state=active]:bg-slate-600/80 data-[state=active]:text-white text-xs sm:text-sm py-2">Transferencia</TabsTrigger>
              </TabsList>
              <TabsContent value="stripe" className="mt-4 p-4 bg-slate-800/30 rounded-md">
                 {!plan.stripe_price_id && <p className="text-sm text-yellow-400 flex items-center"><Info className="w-4 h-4 mr-2 text-yellow-300"/>Este plan no tiene un ID de precio de Stripe configurado. Contacta a soporte.</p>}
                 {plan.stripe_price_id && <p className="text-sm text-gray-300 flex items-center"><Info className="w-4 h-4 mr-2 text-indigo-400"/>Serás redirigido a Stripe para completar el pago de forma segura.</p>}
                 {STRIPE_PUBLISHABLE_KEY === "pk_live_YOUR_REAL_STRIPE_PUBLISHABLE_KEY" && <p className="text-xs text-yellow-400 mt-2">Stripe no está configurado con una clave de producción.</p>}
              </TabsContent>
              <TabsContent value="paypal" className="mt-4 p-4 bg-slate-800/30 rounded-md">
                <p className="text-sm text-gray-300 flex items-center"><Info className="w-4 h-4 mr-2 text-blue-400"/>Serás redirigido a PayPal para completar el pago (simulación).</p>
                 <p className="text-xs text-yellow-400 mt-2">La integración real de PayPal requiere configuración adicional y es actualmente una simulación.</p>
              </TabsContent>
              <TabsContent value="transfer" className="mt-4 p-4 bg-slate-800/30 rounded-md">
                <p className="text-sm text-gray-300 mb-2 flex items-center"><Info className="w-4 h-4 mr-2 text-slate-400"/>Instrucciones para transferencia bancaria:</p>
                <ul className="list-disc list-inside text-xs text-gray-400 pl-4">
                    <li>Banco: MyResell Bank Global</li>
                    <li>Cuenta: 000-111222-33</li>
                    <li>Beneficiario: MyResell Payments LLC</li>
                    <li>Concepto: Suscripción {plan.name} - {user?.email}</li>
                </ul>
                 <p className="text-xs text-yellow-400 mt-2">La activación es manual y puede tardar hasta 24-48h tras confirmar el pago.</p>
              </TabsContent>
            </Tabs>

            {(selectedPaymentMethod === 'paypal' || selectedPaymentMethod === 'transfer') && (
              <div className="text-center text-sm text-gray-500 italic">
                Este método de pago es actualmente simulado o requiere proceso manual.
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={paymentActions[selectedPaymentMethod]} 
              className={`w-full bg-gradient-to-r ${paymentMethodDetails[selectedPaymentMethod].color} hover:opacity-90 text-lg py-3 neon-glow`}
              disabled={processingPayment || !user || (selectedPaymentMethod === 'stripe' && (!plan.stripe_price_id || STRIPE_PUBLISHABLE_KEY === "pk_live_YOUR_REAL_STRIPE_PUBLISHABLE_KEY"))}
            >
              {processingPayment ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...
                </>
              ) : (
                <>
                  <CurrentPaymentIcon className="mr-2 h-5 w-5" /> {paymentMethodDetails[selectedPaymentMethod].buttonText}
                </>
              )}
            </Button>
          </CardFooter>
            {!user && <p className="text-center text-yellow-400 text-sm mt-4">Debes <Link to="/login" className="underline hover:text-purple-300">iniciar sesión</Link> para suscribirte.</p>}
        </Card>
      </motion.div>
    </div>
  );
};

export default Checkout;
