import { useEffect, useState } from 'react';
import axios from 'axios';

export const useStorefrontData = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/products')
        ]);
        setCategories(categoriesResponse.data);
        setProducts(productsResponse.data);
      } catch (err) {
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

  return { categories, products, loading, error, filterProductsByCategory };
};
