/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

/**
 * A reusable modal dialog for confirmation prompts.
 */
export default function ConfirmationDialog({ isOpen, onClose, onConfirm, title, children }) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="whatsapp-dialog-overlay" onClick={onClose}>
      <div className="whatsapp-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="whatsapp-dialog-header">
          <h3>{title}</h3>
          <button className="iconButton" onClick={onClose}>
            <span className="icon">close</span>
          </button>
        </div>
        <div className="confirmation-dialog-content">
          {children}
        </div>
        <div className="confirmation-dialog-actions">
          <button className="button minor" onClick={onClose}>
            Cancelar
          </button>
          <button className="button primary" onClick={handleConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
