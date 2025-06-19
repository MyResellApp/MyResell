import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Términos y Condiciones</h1>
          <p className="text-lg text-gray-400">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-effect p-8 rounded-xl space-y-6"
        >
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">1. Aceptación de los Términos</h2>
            <p className="text-gray-300 leading-relaxed">
              Al acceder y utilizar MyResell (el "Servicio"), usted acepta estar sujeto a estos Términos y Condiciones ("Términos"). Si no está de acuerdo con alguna parte de los términos, no podrá acceder al Servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">2. Descripción del Servicio</h2>
            <p className="text-gray-300 leading-relaxed">
              MyResell proporciona una plataforma para conectar a revendedores con proveedores de diversos productos. Ofrecemos diferentes planes de suscripción con distintos niveles de acceso a proveedores e información.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">3. Cuentas de Usuario</h2>
            <p className="text-gray-300 leading-relaxed">
              Para acceder a ciertas funciones del Servicio, debe registrarse y crear una cuenta. Usted es responsable de mantener la confidencialidad de su contraseña y cuenta. Usted se compromete a notificarnos inmediatamente cualquier uso no autorizado de su cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">4. Pagos y Suscripciones</h2>
            <p className="text-gray-300 leading-relaxed">
              Los planes de suscripción se facturan de forma recurrente (mensual o anual). Los pagos no son reembolsables, excepto según lo exija la ley. Nos reservamos el derecho de cambiar nuestras tarifas de suscripción con previo aviso.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">5. Uso Aceptable</h2>
            <p className="text-gray-300 leading-relaxed">
              Usted se compromete a no utilizar el Servicio para ningún propósito ilegal o prohibido por estos Términos. No debe intentar obtener acceso no autorizado a nuestros sistemas o redes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">6. Propiedad Intelectual</h2>
            <p className="text-gray-300 leading-relaxed">
              El Servicio y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de MyResell y sus licenciantes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">7. Limitación de Responsabilidad</h2>
            <p className="text-gray-300 leading-relaxed">
              En la máxima medida permitida por la ley aplicable, en ningún caso MyResell será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">8. Cambios en los Términos</h2>
            <p className="text-gray-300 leading-relaxed">
              Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso de al menos 30 días antes de que entren en vigor los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">9. Contacto</h2>
            <p className="text-gray-300 leading-relaxed">
              Si tiene alguna pregunta sobre estos Términos, por favor contáctenos en <a href="mailto:legal@myresell.com" className="text-purple-400 hover:underline">legal@myresell.com</a>.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;