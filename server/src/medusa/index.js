import { MedusaApp } from './framework.js';
import { catalogModule } from './modules/catalog.js';
import { cartModule } from './modules/cart.js';

export const createMedusaApp = (config = {}) => {
  const app = new MedusaApp({
    config,
    modules: [catalogModule, cartModule]
  });
  return app;
};
