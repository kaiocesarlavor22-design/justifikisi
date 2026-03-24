import React, { useState, useEffect } from 'react';
import c from 'clsx';
import { addNotification, setCurrentView } from '../lib/actions';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import useStore from '../lib/store';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function Pricing() {
  const { user, userPlan } = useStore();
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/paypal-config')
      .then(res => res.json())
      .then(data => setPaypalClientId(data.clientId))
      .catch(err => console.error('Error fetching PayPal config:', err));
  }, []);

  const handleSimulatedPurchase = async (planId: string) => {
    if (!user) {
      addNotification('Você precisa estar logado para assinar um plano.', 'error');
      return;
    }

    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        plan: planId,
        updatedAt: new Date().toISOString()
      });
      addNotification(`Plano ${planId.toUpperCase()} assinado com sucesso!`, 'info');
      setCurrentView('home');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const renderPlanCard = (planId: string, name: string, amount: string, description: string, features: string[], recommended = false) => (
    <div className={c("bg-black rounded-2xl shadow-xl overflow-hidden flex flex-col relative border", {
      "border-primary": recommended,
      "border-primary/20": !recommended
    })}>
      {recommended && (
        <div className="absolute top-0 right-0 bg-primary text-black px-4 py-1 text-sm font-bold rounded-bl-lg">
          RECOMENDADO
        </div>
      )}
      <div className="p-8 border-b border-primary/10">
        <h2 className="text-2xl font-bold text-white mb-2">{name}</h2>
        <p className="text-primary/60 mb-6">{description}</p>
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-primary">R$ {amount}</span>
          <span className="text-primary/40 ml-2">/mês</span>
        </div>
      </div>
      <div className="p-8 flex-grow">
        <ul className="space-y-4 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center text-white/80">
              <span className="icon text-primary mr-2">check_circle</span>
              {feature}
            </li>
          ))}
        </ul>
        
        <div className="space-y-4">
          {userPlan === planId ? (
            <button className="button minor w-full" disabled>Plano Atual</button>
          ) : (
            <>
              {paypalClientId ? (
                <div className="paypal-button-container">
                  <PayPalButtons
                    style={{ layout: "vertical", height: 50 }}
                    createOrder={async (data, actions) => {
                      const response = await fetch('/api/paypal/create-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ planId })
                      });
                      const orderData = await response.json();
                      return actions.order.create(orderData);
                    }}
                    onApprove={async (data, actions) => {
                      if (actions.order) {
                        await actions.order.capture();
                        handleSimulatedPurchase(planId);
                      }
                    }}
                    onError={(err) => {
                      console.error('PayPal Error:', err);
                      addNotification('Erro no pagamento via PayPal.', 'error');
                    }}
                  />
                </div>
              ) : (
                <button className="button primary w-full" onClick={() => handleSimulatedPurchase(planId)}>
                  Assinar Agora (Simulado)
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <PayPalScriptProvider options={{ clientId: paypalClientId || "test", currency: "BRL" }}>
      <div className="pricing-container p-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">Escolha seu Plano</h1>
          <p className="text-primary/60 text-lg">
            Potencialize sua produtividade com acesso ilimitado às nossas ferramentas de IA para documentos jurídicos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {renderPlanCard(
            'basic', 
            'Plano Standard', 
            '180', 
            'Ideal para profissionais autônomos.',
            ['Geração ilimitada de documentos', 'Análise de documentos jurídicos', 'Suporte via e-mail']
          )}
          
          {renderPlanCard(
            'pro', 
            'Plano Premium', 
            '280', 
            'Para escritórios e gestores.',
            ['Tudo do Plano Standard', 'Consultoria de Jurisprudência', 'Suporte prioritário 24/7'],
            true
          )}
        </div>

        <div className="mt-16 text-center text-primary/40 text-sm">
          <p>Pagamentos processados com segurança via <strong>PayPal</strong>.</p>
          <p className="mt-2">Dúvidas? Entre em contato com nosso suporte.</p>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
