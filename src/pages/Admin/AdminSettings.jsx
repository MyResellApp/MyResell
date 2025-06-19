
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, Settings, DollarSign, Edit, Trash2, PlusCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";

const AdminSettings = () => {
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [planFormData, setPlanFormData] = useState({
    name: '', description: '', price: '', features: [''], stripe_price_id: ''
  });
  const [loadingAction, setLoadingAction] = useState(false);
  const { toast } = useToast();

  const fetchPlans = async () => {
    setLoadingPlans(true);
    const { data, error } = await supabase.from('plans').select('*').order('price', { ascending: true });
    if (error) {
      toast({ title: "Error", description: "No se pudieron cargar los planes.", variant: "destructive" });
    } else {
      setPlans(data.map(p => ({ ...p, features: Array.isArray(p.features) ? p.features : JSON.parse(p.features || '[]') })));
    }
    setLoadingPlans(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePlanInputChange = (e) => {
    const { name, value } = e.target;
    setPlanFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...planFormData.features];
    newFeatures[index] = value;
    setPlanFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeatureField = () => {
    setPlanFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };
  
  const removeFeatureField = (index) => {
    if (planFormData.features.length <= 1) return; // Keep at least one feature
    const newFeatures = planFormData.features.filter((_, i) => i !== index);
    setPlanFormData(prev => ({ ...prev, features: newFeatures }));
  };


  const resetPlanForm = () => {
    setPlanFormData({ name: '', description: '', price: '', features: [''], stripe_price_id: '' });
    setCurrentPlan(null);
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    if (!planFormData.name || !planFormData.price) {
        toast({ title: "Campos requeridos", description: "Nombre y precio del plan son obligatorios.", variant: "destructive"});
        return;
    }
    setLoadingAction(true);
    const dataToSubmit = {
        ...planFormData,
        features: JSON.stringify(planFormData.features.filter(f => f.trim() !== '')), // Store as JSON string, remove empty features
        price: parseFloat(planFormData.price)
    };

    let error;
    if (currentPlan) {
      const { error: updateError } = await supabase.from('plans').update(dataToSubmit).eq('id', currentPlan.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('plans').insert(dataToSubmit);
      error = insertError;
    }

    if (error) {
      toast({ title: "Error", description: `Error al ${currentPlan ? 'actualizar' : 'crear'} plan: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Éxito", description: `Plan ${currentPlan ? 'actualizado' : 'creado'} correctamente.` });
      setIsPlanModalOpen(false);
      resetPlanForm();
      fetchPlans();
    }
    setLoadingAction(false);
  };

  const handleEditPlan = (plan) => {
    setCurrentPlan(plan);
    setPlanFormData({
      name: plan.name || '',
      description: plan.description || '',
      price: plan.price || '',
      features: Array.isArray(plan.features) ? (plan.features.length > 0 ? plan.features : ['']) : [''],
      stripe_price_id: plan.stripe_price_id || ''
    });
    setIsPlanModalOpen(true);
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este plan? Esto podría afectar a usuarios suscritos.")) return;
    setLoadingAction(true);
    // Considerar la lógica de qué sucede con los usuarios suscritos a este plan.
    // Podrías marcarlos como 'legacy' o requerir una migración.
    const { error } = await supabase.from('plans').delete().eq('id', planId);
    if (error) {
      toast({ title: "Error", description: `Error al eliminar plan: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Éxito", description: "Plan eliminado. Revisa las suscripciones afectadas." });
      fetchPlans();
    }
    setLoadingAction(false);
  };
  
  const TextareaComponent = Textarea || ((props) => <textarea {...props} className="w-full p-2 border rounded bg-slate-700 border-slate-600" />);


  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center"><Settings className="mr-3 h-8 w-8 text-purple-400"/>Configuración General</h1>
        </div>

        {/* Gestión de Planes */}
        <Card className="mb-10 glass-effect border-purple-500/30">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle className="text-2xl text-white flex items-center"><DollarSign className="mr-2 h-6 w-6 text-green-400"/>Gestionar Planes de Suscripción</CardTitle>
                <CardDescription className="text-gray-400">Añade, edita o elimina planes.</CardDescription>
            </div>
            <Button onClick={() => { resetPlanForm(); setIsPlanModalOpen(true); }} className="bg-purple-600 hover:bg-purple-700">
              <PlusCircle className="mr-2 h-5 w-5" /> Añadir Plan
            </Button>
          </CardHeader>
          <CardContent>
            {loadingPlans ? (
              <div className="flex justify-center py-8"><Loader2 className="h-10 w-10 animate-spin text-purple-500" /></div>
            ) : plans.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No hay planes configurados.</p>
            ) : (
              <div className="space-y-4">
                {plans.map(plan => (
                  <div key={plan.id} className="p-4 bg-slate-700/50 rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-300">{plan.name} - ${plan.price}/mes</h3>
                      <p className="text-sm text-gray-400 truncate max-w-md">{plan.description}</p>
                      <p className="text-xs text-gray-500">Stripe Price ID: {plan.stripe_price_id || 'No asignado'}</p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditPlan(plan)} className="text-blue-400 hover:text-blue-300"><Edit className="h-4 w-4"/></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(plan.id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl">{currentPlan ? 'Editar' : 'Nuevo'} Plan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handlePlanSubmit} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <Label htmlFor="planName">Nombre del Plan</Label>
                <Input id="planName" name="name" value={planFormData.name} onChange={handlePlanInputChange} className="bg-slate-700 border-slate-600" />
              </div>
              <div>
                <Label htmlFor="planDescription">Descripción</Label>
                <TextareaComponent id="planDescription" name="description" value={planFormData.description} onChange={handlePlanInputChange} className="bg-slate-700 border-slate-600" />
              </div>
              <div>
                <Label htmlFor="planPrice">Precio (USD)</Label>
                <Input id="planPrice" name="price" type="number" step="0.01" value={planFormData.price} onChange={handlePlanInputChange} className="bg-slate-700 border-slate-600" />
              </div>
              <div>
                <Label htmlFor="stripe_price_id">Stripe Price ID (Opcional)</Label>
                <Input id="stripe_price_id" name="stripe_price_id" value={planFormData.stripe_price_id} onChange={handlePlanInputChange} className="bg-slate-700 border-slate-600" placeholder="price_xxxxxxxxxxxxxx"/>
              </div>
              <div>
                <Label>Características del Plan</Label>
                {planFormData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-1">
                    <Input 
                      type="text" 
                      value={feature} 
                      onChange={(e) => handleFeatureChange(index, e.target.value)} 
                      placeholder={`Característica ${index + 1}`}
                      className="bg-slate-700 border-slate-600 flex-grow"
                    />
                    {planFormData.features.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFeatureField(index)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4"/>
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addFeatureField} className="mt-2 text-purple-400 border-purple-600 hover:bg-purple-700/30">
                  <PlusCircle className="mr-2 h-4 w-4"/> Añadir Característica
                </Button>
              </div>
              <DialogFooter className="pt-4">
                <DialogClose asChild><Button type="button" variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">Cancelar</Button></DialogClose>
                <Button type="submit" disabled={loadingAction} className="bg-purple-600 hover:bg-purple-700">
                  {loadingAction ? <Loader2 className="animate-spin mr-2" /> : null}
                  {currentPlan ? 'Guardar Cambios' : 'Crear Plan'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Placeholder for other settings like payment gateway keys, email templates, etc. */}
        <Card className="glass-effect border-purple-500/30">
            <CardHeader>
                <CardTitle className="text-2xl text-white">Otras Configuraciones</CardTitle>
                <CardDescription className="text-gray-400">Ajustes de pasarelas de pago, emails, etc. (Próximamente)</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-gray-400">Aquí podrás configurar tus claves de API para Stripe y PayPal, personalizar plantillas de correo electrónico, y más.</p>
                <div className="mt-4 space-y-2">
                    <Input placeholder="Tu Stripe Publishable Key (pk_live_...)" disabled className="bg-slate-700 border-slate-600 opacity-50"/>
                    <Input placeholder="Tu Stripe Secret Key (sk_live_...)" type="password" disabled className="bg-slate-700 border-slate-600 opacity-50"/>
                    <Input placeholder="Tu PayPal Client ID" disabled className="bg-slate-700 border-slate-600 opacity-50"/>
                </div>
                 <p className="text-xs text-yellow-400 mt-2">La gestión de claves API sensibles se realizará de forma segura, posiblemente a través de secretos de Supabase.</p>
            </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AdminSettings;
