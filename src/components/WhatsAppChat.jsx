/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState } from 'react';

// IMPORTANTE: Contato do Dr. Israel para suporte via WhatsApp.
const WHATSAPP_NUMBER = '5586999004114'; 

const chatOptions = [
  { text: 'Falar com um Advogado', message: 'Olá, gostaria de falar com um advogado.', icon: 'gavel' },
  { text: 'Falar com o Escritório', message: 'Olá, gostaria de falar com o escritório.', icon: 'business_center' },
  { text: 'Falar com um Especialista', message: 'Olá, gostaria de falar com um especialista.', icon: 'school' },
  { text: 'Falar com a Secretária', message: 'Olá, gostaria de falar com a secretária.', icon: 'event_note' },
  { text: 'Preciso de Ajuda', message: 'Olá, preciso de ajuda com a plataforma JUSTIFIKISI.', icon: 'help_outline' },
];

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (message) => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <>
      <button className="iconButton whatsapp-chat-button" onClick={() => setIsOpen(true)}>
        <span className="icon">sms</span>
        <span className="tooltip">Fale Conosco</span>
      </button>

      {isOpen && (
        <div className="whatsapp-dialog-overlay" onClick={() => setIsOpen(false)}>
          <div className="whatsapp-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="whatsapp-dialog-header">
              <h3>Fale Conosco via WhatsApp</h3>
              <button className="iconButton" onClick={() => setIsOpen(false)}>
                <span className="icon">close</span>
              </button>
            </div>
            <div className="whatsapp-dialog-options">
              {chatOptions.map(option => (
                <button
                  key={option.text}
                  className="whatsapp-option-button"
                  onClick={() => handleOptionClick(option.message)}
                >
                  <span className="icon">{option.icon}</span>
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}