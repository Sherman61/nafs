import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Checkout from './pages/Checkout.jsx';
import ProductEdit from './pages/ProductEdit.jsx';
import CustomerService from './pages/CustomerService.jsx';
import Storefront from './pages/Storefront.jsx';
import { stripBasePath, withBasePath } from './utils/routing.js';

const routes = {
  '/': Storefront,
  '/admin': AdminDashboard,
  '/checkout': Checkout,
  '/customer-service': CustomerService,
  '/admin/products/edit': ProductEdit
};

const getPathname = () => {
  if (typeof window === 'undefined') return '/';
  return stripBasePath(window.location.pathname);
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
      const normalizedPath = stripBasePath(nextPath);
      if (!normalizedPath || normalizedPath === path) return;
      window.history.pushState({}, '', withBasePath(normalizedPath));
      setPath(normalizedPath);
    },
    [path]
  );

  const PageComponent = useMemo(() => routes[path] ?? Storefront, [path]);

  return <PageComponent navigate={navigate} />;
}
