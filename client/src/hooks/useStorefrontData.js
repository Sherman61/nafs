import { useEffect, useState } from 'react';
import axios from 'axios';
import { fallbackCategories, fallbackProducts } from '../data/fallbackCatalog.js';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';
const apiClient = axios.create({ baseURL: apiBaseUrl });

export const useStorefrontData = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUsedFallback(false);
        setError(null);
        const [categoriesResponse, productsResponse] = await Promise.all([
          apiClient.get('/categories'),
          apiClient.get('/products')
        ]);
        setCategories(categoriesResponse.data);
        setProducts(productsResponse.data);
      } catch (err) {
        console.error('Failed to load API data. Falling back to bundled seed data.', err);
        setCategories(fallbackCategories);
        setProducts(fallbackProducts);
        setUsedFallback(true);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterProductsByCategory = (categoryId) => {
    if (!categoryId) return products;
    return products.filter((product) => product.categoryId === categoryId);
  };

  return { categories, products, loading, error, filterProductsByCategory, usedFallback };
};
