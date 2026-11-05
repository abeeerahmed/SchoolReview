import { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';

export function NetworkBanner() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    Network.getStatus().then((s) => setOffline(!s.connected)).catch(() => {});
    const handle = Network.addListener('networkStatusChange', (s) => setOffline(!s.connected));
    return () => { handle.then((h) => h.remove()); };
  }, []);
  if (!offline) return null;
  return <div className="bg-amber-500 text-white text-center text-sm py-2 px-4">You are offline. Some features may not work.</div>;
}