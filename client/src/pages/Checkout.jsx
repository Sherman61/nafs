import { useMemo, useState } from 'react';

const CART_STORAGE_KEY = 'medusah-cart';

const getStoredCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to read stored cart items', error);
    return [];
  }
};

const defaultForm = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  region: '',
  postalCode: '',
  shippingMethod: 'standard',
  paymentMethod: 'card'
};

const shippingRates = {
  standard: 0,
  express: 18
};

export default function Checkout({ navigate }) {
  const [cartItems, setCartItems] = useState(() => getStoredCart());
  const [formData, setFormData] = useState(defaultForm);
  const [feedback, setFeedback] = useState(null);
  const [processing, setProcessing] = useState(false);

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );
  const shipping = shippingRates[formData.shippingMethod] ?? 0;
  const total = subtotal + shipping;

  const persistCart = (items) => {
    if (typeof window === 'undefined') return;
    try {
      if (items.length === 0) {
        window.localStorage.removeItem(CART_STORAGE_KEY);
      } else {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      }
    } catch (error) {
      console.error('Failed to persist cart items', error);
    }
  };

  const handleQuantityChange = (id, delta) => {
    setCartItems((prev) => {
      const next = prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0);
      persistCart(next);
      return next;
    });
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      persistCart(next);
      return next;
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedback(null);
    if (cartItems.length === 0) {
      setFeedback({ type: 'error', message: 'Add products to your cart before checking out.' });
      return;
    }

    if (!formData.fullName || !formData.email || !formData.address) {
      setFeedback({ type: 'error', message: 'Shipping contact information is required.' });
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setFeedback({
        type: 'success',
        message: 'Order routed to fulfillment. Keep iterating to connect your live Medusa backend.'
      });
      setCartItems([]);
      persistCart([]);
    }, 600);
  };

  const handleNavigate = (path) => {
    if (navigate) {
      navigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  return (
    <div className="min-h-screen bg-brand-light px-4 py-10 text-brand-dark">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-dark/60">Checkout</p>
            <h1 className="text-4xl font-display">Confirm your ritual order</h1>
            <p className="mt-2 text-brand-dark/70">
              Cart items now persist locally so you can design an end-to-end checkout flow before wiring
              it up to your API.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleNavigate('/')}
              className="rounded-full border border-brand-dark/20 px-5 py-2 text-sm font-semibold"
            >
              Continue shopping
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('/admin/products/edit')}
              className="rounded-full border border-brand-dark/20 px-5 py-2 text-sm font-semibold"
            >
              Edit catalog
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-4 rounded-[32px] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display">Order summary</h2>
              <span className="text-sm text-brand-dark/60">{cartItems.length} items</span>
            </div>
            {cartItems.length === 0 ? (
              <p className="text-brand-dark/70">Your cart is empty. Head back to the storefront to add products.</p>
            ) : (
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.media}
                      alt={item.name}
                      className="h-16 w-16 rounded-2xl object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-brand-dark/70">${item.price.toFixed(2)}</p>
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-brand-dark/10 px-3 py-1 text-xs">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          aria-label={`Decrease ${item.name}`}
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          aria-label={`Increase ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-xs text-brand-dark/60 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="space-y-2 border-t pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Included' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-[32px] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-display">Shipping & payment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold" htmlFor="fullName">
                    Full name*
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
                    placeholder="Sora Wave"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold" htmlFor="email">
                    Email*
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold" htmlFor="address">
                  Address*
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
                  placeholder="44 Luminous St"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-semibold" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleFormChange}
                    className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold" htmlFor="region">
                    Region
                  </label>
                  <input
                    id="region"
                    name="region"
                    type="text"
                    value={formData.region}
                    onChange={handleFormChange}
                    className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold" htmlFor="postalCode">
                    Postal code
                  </label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={handleFormChange}
                    className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold">Shipping method</p>
                <div className="mt-2 space-y-2">
                  {Object.keys(shippingRates).map((method) => (
                    <label
                      key={method}
                      className="flex items-center justify-between rounded-2xl border border-brand-dark/20 px-4 py-2"
                    >
                      <div>
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={method}
                          checked={formData.shippingMethod === method}
                          onChange={handleFormChange}
                          className="mr-3"
                        />
                        <span className="capitalize">{method}</span>
                      </div>
                      <span className="text-sm text-brand-dark/70">
                        {shippingRates[method] === 0
                          ? 'Included'
                          : `$${shippingRates[method].toFixed(2)}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold" htmlFor="paymentMethod">
                  Payment method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
                >
                  <option value="card">Card (demo)</option>
                  <option value="apple-pay">Apple Pay</option>
                  <option value="wire">Wire transfer</option>
                </select>
              </div>

              {feedback && (
                <p
                  role="status"
                  className={`rounded-2xl px-4 py-2 text-sm ${
                    feedback.type === 'error'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {feedback.message}
                </p>
              )}

              <button
                type="submit"
                disabled={processing}
                className={`w-full rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition ${
                  processing ? 'bg-brand-dark/40 cursor-not-allowed' : 'bg-brand-dark hover:bg-brand-dark/80'
                }`}
              >
                {processing ? 'Routing order…' : 'Place order'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
