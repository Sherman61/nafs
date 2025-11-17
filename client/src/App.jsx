import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Storefront from './pages/Storefront.jsx';

const routes = {
  '/': Storefront,
  '/admin': AdminDashboard
};

const getPathname = () => {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
};

export default function App() {
  const [path, setPath] = useState(getPathname);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handlePopState = () => setPath(getPathname());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback(
    (nextPath) => {
      if (typeof window === 'undefined') return;
      if (!nextPath || nextPath === path) return;
      window.history.pushState({}, '', nextPath);
      setPath(nextPath);
    },
    [path]
  );

  const PageComponent = useMemo(() => routes[path] ?? Storefront, [path]);

  return <PageComponent navigate={navigate} />;
}
