import { useEffect, useState } from 'react';
export function useHashRoute() {
  const [route, setRoute] = useState<string>(() => location.hash.replace(/^#/, '') || '/');
  useEffect(() => { const onChange = () => setRoute(location.hash.replace(/^#/, '') || '/'); window.addEventListener('hashchange', onChange); return () => window.removeEventListener('hashchange', onChange); }, []);
  function navigate(path: string) { if (!path.startsWith('/')) path = '/' + path; location.hash = path; }
  return { route, navigate };
}