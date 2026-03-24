/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {createRoot} from 'react-dom/client';
import './main.css';
import App from './src/components/App.jsx';
import ErrorBoundary from './src/components/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
