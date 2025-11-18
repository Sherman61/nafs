import { useEffect, useState } from 'react';
import axios from 'axios';
import { fallbackCategories, fallbackProducts } from '../data/fallbackCatalog.js';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:9000';
const apiClient = axios.create({ baseURL: apiBaseUrl });

const mapCategories = (categories = []) =>
  categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description ?? ''
  }));

const mapProducts = (products = []) =>
  products.map((product) => {
    const firstVariant = product.variants?.[0];
    const primaryPrice = firstVariant?.prices?.[0];
    const category = product.categories?.[0];

    return {
      id: product.id,
      name: product.title,
      price: primaryPrice ? primaryPrice.amount / 100 : 0,
      currencyCode: primaryPrice?.currency_code ?? 'usd',
      categoryId: category?.id ?? 'featured',
      categoryLabel: category?.name ?? 'Featured',
      media: product.thumbnail ?? product.images?.[0]?.url ?? '',
      shortDescription: product.subtitle ?? product.description ?? '',
      description: product.description ?? ''
    };
  });

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
        const [{ data: categoriesResponse }, { data: productsResponse }] = await Promise.all([
          apiClient.get('/store/product-categories'),
          apiClient.get('/store/products', {
            params: {
              expand: 'categories,images,variants,options',
              limit: 50
            }
          })
        ]);

        setCategories(mapCategories(categoriesResponse.product_categories));
        setProducts(mapProducts(productsResponse.products));
      } catch (err) {
        console.error('Failed to load Medusa data. Falling back to bundled seed data.', err);
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
