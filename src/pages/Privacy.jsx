import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <ShieldCheck className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Política de Privacidad</h1>
          <p className="text-lg text-gray-400">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-effect p-8 rounded-xl space-y-6"
        >
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">1. Introducción</h2>
            <p className="text-gray-300 leading-relaxed">
              MyResell ("nosotros", "nuestro" o "nos") se compromete a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos su información cuando visita nuestro sitio web y utiliza nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">2. Información que Recopilamos</h2>
            <p className="text-gray-300 leading-relaxed">
              Podemos recopilar información personal identificable, como su nombre, dirección de correo electrónico, información de pago y otra información que nos proporcione voluntariamente. También podemos recopilar información no personal, como datos de uso y tipo de navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">3. Cómo Usamos Su Información</h2>
            <p className="text-gray-300 leading-relaxed">
              Usamos la información que recopilamos para:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>Proveer, operar y mantener nuestro Servicio.</li>
              <li>Mejorar, personalizar y expandir nuestro Servicio.</li>
              <li>Entender y analizar cómo utiliza nuestro Servicio.</li>
              <li>Desarrollar nuevos productos, servicios, características y funcionalidades.</li>
              <li>Comunicarnos con usted, ya sea directamente o a través de uno de nuestros socios, incluso para servicio al cliente, para proporcionarle actualizaciones y otra información relacionada con el Servicio, y para fines de marketing y promoción.</li>
              <li>Procesar sus transacciones.</li>
              <li>Enviarle correos electrónicos.</li>
              <li>Encontrar y prevenir el fraude.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">4. Divulgación de Su Información</h2>
            <p className="text-gray-300 leading-relaxed">
              No venderemos, comercializaremos ni alquilaremos su información personal a terceros. Podemos compartir información con proveedores de servicios externos que nos ayudan a operar nuestro negocio o administrar actividades en nuestro nombre, como el procesamiento de pagos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">5. Seguridad de Su Información</h2>
            <p className="text-gray-300 leading-relaxed">
              Utilizamos medidas de seguridad administrativas, técnicas y físicas para ayudar a proteger su información personal. Si bien hemos tomado medidas razonables para asegurar la información personal que nos proporciona, tenga en cuenta que ninguna medida de seguridad es perfecta o impenetrable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">6. Sus Derechos de Protección de Datos</h2>
            <p className="text-gray-300 leading-relaxed">
              Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal, como el derecho a acceder, corregir o eliminar sus datos personales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">7. Cambios a Esta Política de Privacidad</h2>
            <p className="text-gray-300 leading-relaxed">
              Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">8. Contacto</h2>
            <p className="text-gray-300 leading-relaxed">
              Si tiene alguna pregunta sobre esta Política de Privacidad, por favor contáctenos en <a href="mailto:privacy@myresell.com" className="text-purple-400 hover:underline">privacy@myresell.com</a>.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;