import express from 'express';
import cors from 'cors';
import { createMedusaApp } from './medusa/index.js';

export const buildApp = ({ config } = {}) => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const medusa = createMedusaApp(config);
  const catalogService = medusa.resolve('catalogService');
  const cartService = medusa.resolve('cartService');

  app.locals.medusa = medusa;

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  app.get('/api/categories', (req, res) => {
    res.json(catalogService.listCategories());
  });

  app.get('/api/products', (req, res) => {
    const { category } = req.query;
    const data = catalogService.listProducts({ categoryId: category });
    res.json(data);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = catalogService.retrieveProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/cart', (req, res) => {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }
    const cart = cartService.createCart(items);
    res.status(201).json(cart);
  });

  app.get('/api/cart/:cartId', (req, res) => {
    const cart = cartService.retrieveCart(req.params.cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  });

  return app;
};

export default buildApp;
