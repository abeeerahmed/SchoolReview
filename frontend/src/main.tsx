import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootEl = document.getElementById('root');
if (!rootEl) {
  document.body.innerHTML = '<h1>ROOT NOT FOUND</h1>';
} else {
  const root = createRoot(rootEl);
  root.render(<App />);
  document.body.setAttribute('data-rendered', 'true');
}