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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

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
        navigate('/pricing');
      } else {
        setPlan({ ...data, features: Array.isArray(data.features) ? data.features : JSON.parse(data.features || '[]') });
      }
      setLoadingPlan(false);
    };

    fetchPlanDetails();
  }, [planId, navigate, toast]);

  const handleStripePayment = async () => {
    if (!user || !plan || !plan.stripe_price_id) {
      toast({ title: "Error de Configuración", description: "Falta información del usuario o del plan.", variant: "destructive" });
      return;
    }

    const key = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    if (!key || key === "pk_live_YOUR_REAL_STRIPE_PUBLISHABLE_KEY" || key.includes("pk_test_")) {
      toast({ title: "Configuración Requerida", description: "Configura tu Stripe Publishable Key (Live).", variant: "destructive", duration: 7000 });
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

      if (sessionError || !checkoutSession?.id) {
        toast({
          title: "Error de Pago",
          description: sessionError?.message || "Error creando sesión de pago.",
          variant: "destructive"
        });
        setProcessingPayment(false);
        return;
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: checkoutSession.id,
      });

      if (stripeError) {
        toast({ title: "Redirección Fallida", description: stripeError.message, variant: "destructive" });
        setProcessingPayment(false);
      }

    } catch (error) {
      toast({ title: "Error Inesperado", description: error.message, variant: "destructive" });
      setProcessingPayment(false);
    }
  };

  const handlePayPalPayment = async () => {
    if (!user || !plan) return;
    setProcessingPayment(true);
    toast({ title: "PayPal (Simulado)", description: "Procesando pago simulado...", duration: 7000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    const simulatedSuccess = Math.random() > 0.3;
    if (simulatedSuccess) {
      await createSubscriptionRecord(`paypal_sim_${Date.now()}`, 'paypal');
    } else {
      navigate('/payment/cancel', { state: { planName: plan.name, error: "Falló la simulación de pago con PayPal." } });
    }
    setProcessingPayment(false);
  };

  const handleBankTransfer = async () => {
    if (!user || !plan) return;
    setProcessingPayment(true);
    toast({ title: "Transferencia Bancaria", description: "Instrucciones enviadas. Activación manual.", duration: 10000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    await createSubscriptionRecord(`transfer_manual_${Date.now()}`, 'transfer');
    setProcessingPayment(false);
  };

  const createSubscriptionRecord = async (transactionId, paymentMethod) => {
    try {
      await supabase
        .from('subscriptions')
        .update({ status: 'inactive', end_date: new Date().toISOString() })
        .match({ user_id: user.id, status: 'active' });

      const { data: newSubscription } = await supabase
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

      await supabase
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

      await fetchUserSubscription(user.id);
      toast({ title: "¡Suscripción Registrada!", description: `Plan ${plan.name} activado.`, duration: 5000 });
      navigate('/payment/success', { state: { planName: plan.name, subscriptionId: newSubscription.id } });

    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      navigate('/payment/cancel', { state: { planName: plan.name, error: error.message } });
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
        <p className="text-gray-400 mb-6">No se pudo encontrar el plan seleccionado.</p>
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
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-xl">
        <Card className="glass-effect border-purple-500/50 shadow-2xl shadow-purple-500/20">
          <CardHeader className="text-center">
            <ShoppingCart className="w-12 h-12 mx-auto text-purple-400 mb-3" />
            <CardTitle className="text-3xl font-bold">Confirmar Suscripción</CardTitle>
            <CardDescription className="text-gray-300">Suscribiéndote al plan <span className="font-semibold text-purple-300">{plan.name}</span>.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Detalles del Plan:</h3>
              <ul className="space-y-1 text-gray-300">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <div className="flex justify-between items-center text-2xl font-bold text-white">
                <span>Total:</span>
                <span>${plan.price}<span className="text-sm font-normal text-gray-400">/mes</span></span>
              </div>
            </div>

            <Tabs value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 p-1">
                <TabsTrigger value="stripe">Stripe</TabsTrigger>
                <TabsTrigger value="paypal">PayPal</TabsTrigger>
                <TabsTrigger value="transfer">Transferencia</TabsTrigger>
              </TabsList>
              <TabsContent value="stripe">
                <p className="text-sm text-gray-300 mt-2">Redirección segura a Stripe.</p>
              </TabsContent>
              <TabsContent value="paypal">
                <p className="text-sm text-blue-400 mt-2">Simulación de pago PayPal.</p>
              </TabsContent>
              <TabsContent value="transfer">
                <p className="text-sm text-slate-400 mt-2">Transferencia manual, activación manual.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button
              onClick={paymentActions[selectedPaymentMethod]}
              className={`w-full bg-gradient-to-r ${paymentMethodDetails[selectedPaymentMethod].color} text-lg py-3`}
              disabled={processingPayment || !user}
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
          {!user && (
            <p className="text-center text-yellow-400 text-sm mt-4">
              Debes <Link to="/login" className="underline">iniciar sesión</Link> para suscribirte.
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Checkout;
