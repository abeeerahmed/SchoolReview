import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('main.tsx executing');
const rootEl = document.getElementById('root');
console.log('root element:', rootEl ? 'found' : 'NOT FOUND');
const root = createRoot(rootEl!);
console.log('root created');
root.render(<App />);
console.log('render called')