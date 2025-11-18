import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from './app.js';

let server;
let baseUrl;

const startServer = () =>
  new Promise((resolve) => {
    const instance = buildApp().listen(0, () => {
      const { port } = instance.address();
      resolve({ instance, url: `http://127.0.0.1:${port}` });
    });
  });

test.before(async () => {
  const started = await startServer();
  server = started.instance;
  baseUrl = started.url;
});

test.after(() => {
  return new Promise((resolve, reject) => {
    if (!server) return resolve();
    server.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
});

test('GET /api/categories returns Lefanek Ahava categories', async () => {
  const response = await fetch(`${baseUrl}/api/categories`);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.ok(Array.isArray(data));
  assert.ok(data.find((category) => category.id === 'cat-tees'));
});

test('GET /api/products lists apparel with category labels', async () => {
  const response = await fetch(`${baseUrl}/api/products`);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.ok(data.length >= 1);
  assert.ok(data.every((product) => typeof product.name === 'string'));
  const tee = data.find((product) => product.id === 'ahava-script-tee');
  assert.equal(tee.categoryLabel, 'Heritage Tee');
});

test('GET /api/products/:id returns a single product', async () => {
  const response = await fetch(`${baseUrl}/api/products/linen-tallit-wrap`);
  assert.equal(response.status, 200);
  const product = await response.json();
  assert.equal(product.id, 'linen-tallit-wrap');
});

test('GET /api/products/:id returns 404 for missing product', async () => {
  const response = await fetch(`${baseUrl}/api/products/unknown-item`);
  assert.equal(response.status, 404);
});
