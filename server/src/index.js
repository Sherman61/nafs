import express from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';
import { categories, products } from './data.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.get('/api/products', (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.json(products);
  }
  const filtered = products.filter((product) => product.categoryId === category);
  res.json(filtered);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((item) => item.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

const carts = new Map();

app.post('/api/cart', (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ message: 'Items must be an array' });
  }
  const cartId = uuid();
  const summary = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product,
      lineTotal: product ? product.price * item.quantity : 0
    };
  });
  const total = summary.reduce((acc, current) => acc + current.lineTotal, 0);
  const cart = { id: cartId, items: summary, total };
  carts.set(cartId, cart);
  res.status(201).json(cart);
});

app.get('/api/cart/:cartId', (req, res) => {
  const cart = carts.get(req.params.cartId);
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  res.json(cart);
});

app.listen(PORT, () => {
  console.log(`Medusah commerce API running on port ${PORT}`);
});
