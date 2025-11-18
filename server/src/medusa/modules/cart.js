import { v4 as uuid } from 'uuid';

class CartService {
  constructor({ catalogService }) {
    this.catalogService = catalogService;
    this.carts = new Map();
  }

  createCart(items = []) {
    const summary = items.map((item) => {
      const product = this.catalogService.retrieveProduct(item.productId);
      return {
        ...item,
        product,
        lineTotal: product ? product.price * item.quantity : 0
      };
    });

    const total = summary.reduce((acc, current) => acc + current.lineTotal, 0);
    const cart = { id: uuid(), items: summary, total };
    this.carts.set(cart.id, cart);
    return cart;
  }

  retrieveCart(id) {
    return this.carts.get(id) || null;
  }
}

export const cartModule = {
  key: 'cartService',
  deps: ['catalogService'],
  factory: ({ catalogService }) => {
    return new CartService({ catalogService });
  }
};

export { CartService };
