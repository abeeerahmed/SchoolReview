import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('main.tsx executing');
const root = createRoot(document.getElementById('root')!);
console.log('root created');
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
console.log('render called')