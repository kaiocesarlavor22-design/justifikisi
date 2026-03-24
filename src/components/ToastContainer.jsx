/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import useStore from '../lib/store';
import { removeNotification } from '../lib/actions';

function Toast({ message, type, onDismiss }) {
  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-message">{message}</span>
      <button onClick={onDismiss} className="toast-close-button" aria-label="Fechar notificação">
        <span className="icon">close</span>
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { notifications } = useStore();

  return (
    <div className="toast-container">
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onDismiss={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}
