import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// CRITICAL: Remove the duplicate DeviceProvider wrapper since App.tsx already has it
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);