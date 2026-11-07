import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './styles.css';

const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

const applyColorScheme = () => {
  document.documentElement.classList.toggle('dark', colorScheme.matches);
  document.documentElement.classList.toggle('light', !colorScheme.matches);
};

applyColorScheme();
colorScheme.addEventListener('change', applyColorScheme);

const root = document.getElementById('root');

if (root === null) {
  throw new Error('Missing #root');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
