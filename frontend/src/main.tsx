import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient();

const rootEl = document.getElementById('root');
if (!rootEl) {
  document.body.innerHTML = '<h1>ROOT NOT FOUND</h1>';
} else {
  const root = createRoot(rootEl);
  root.render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
  document.body.setAttribute('data-rendered', 'true');
}