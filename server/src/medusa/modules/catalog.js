import { categories, products } from '../../data.js';

class CatalogService {
  constructor(seed = {}) {
    this.categories = seed.categories || categories;
    this.products = seed.products || products;
  }

  listCategories() {
    return this.categories;
  }

  listProducts(filters = {}) {
    const { categoryId } = filters;
    if (!categoryId) {
      return this.products;
    }
    return this.products.filter((product) => product.categoryId === categoryId);
  }

  retrieveProduct(id) {
    return this.products.find((product) => product.id === id) || null;
  }
}

export const catalogModule = {
  key: 'catalogService',
  factory: ({ config }) => {
    return new CatalogService(config.seed);
  }
};

export { CatalogService };
