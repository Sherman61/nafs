import { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import ProductCard from '../components/ProductCard.jsx';
import CartDrawer from '../components/CartDrawer.jsx';
import CategoryPills from '../components/CategoryPills.jsx';
import { useStorefrontData } from '../hooks/useStorefrontData.js';

const testimonials = [
  {
    quote:
      'The medusah collection is so intentional. Everything from the packaging to the scents feels like a ritual I look forward to.',
    author: 'Lina, apothecary owner'
  },
  {
    quote: 'I gifted the Moon Oil to my bridal party and they still rave about it. Immediate glow.',
    author: 'Ari, creative director'
  }
];

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';
const normalizedApiBaseUrl = rawApiBaseUrl.endsWith('/')
  ? rawApiBaseUrl.slice(0, -1)
  : rawApiBaseUrl;

export default function Storefront({ navigate }) {
  const { categories, products, loading, error, filterProductsByCategory } = useStorefrontData();
  const [activeCategory, setActiveCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [isCheckoutProcessing, setIsCheckoutProcessing] = useState(false);

  const visibleProducts = useMemo(() => filterProductsByCategory(activeCategory), [
    activeCategory,
    filterProductsByCategory
  ]);

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0 || isCheckoutProcessing) return;

    setCheckoutError('');
    setCheckoutMessage('');
    setIsCheckoutProcessing(true);

    try {
      const response = await fetch(`${normalizedApiBaseUrl}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((item) => ({ productId: item.id, quantity: item.quantity }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to stage checkout');
      }

      const cart = await response.json();
      setCheckoutMessage(
        `Checkout staged. Cart ${cart.id.slice(0, 8)} totals $${cart.total.toFixed(
          2
        )}. Keep shopping or continue to Stripe when ready.`
      );
    } catch (err) {
      console.error('Checkout failed', err);
      setCheckoutError('Checkout failed—ensure the API server on port 5000 is running.');
    } finally {
      setIsCheckoutProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark">
      <Header onCartToggle={() => setIsCartOpen(true)} onNavigate={navigate} />
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-12">
        <section className="hero-bg overflow-hidden rounded-[40px] bg-brand-dark text-white">
          <div className="space-y-6 p-12 md:p-20">
            <p className="text-sm uppercase tracking-[0.4em] text-white/80">Medusah Market</p>
            <h1 className="text-4xl font-display leading-tight md:text-6xl">
              Ritual goods crafted for slow, luminous living.
            </h1>
            <p className="max-w-2xl text-lg text-white/80">
              Built with a lightweight Medusah JS stack (Node + React) to demonstrate how you can
              prototype ecommerce ideas with modern tooling.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-full bg-white px-6 py-3 text-brand-dark">Shop the ritual</button>
              <button className="rounded-full border border-white/70 px-6 py-3 text-white">
                Explore journal
              </button>
            </div>
          </div>
        </section>

        <section id="collections" className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-dark/60">Collections</p>
              <h2 className="text-3xl font-display">Refine the ritual</h2>
            </div>
            <CategoryPills
              categories={categories}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>
          {loading && <p>Loading curated goods…</p>}
          {error && <p className="text-red-700">Failed to load data.</p>}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </section>

        <section id="bestsellers" className="grid gap-8 rounded-[32px] bg-white p-10 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-dark/60">Bestsellers</p>
            <h2 className="mt-2 text-3xl font-display">Revered by the medusah community</h2>
            <p className="mt-4 text-brand-dark/80">
              Every launch is produced in micro batches so ingredients stay potent. Customers adore
              the plush textures, complex scents, and planet-friendly packaging.
            </p>
            <ul className="mt-6 space-y-4 text-sm">
              <li>• Astro candle wax sourced from renewable coconut farms.</li>
              <li>• Moon Oil bottled in UV-protective violet glass.</li>
              <li>• Aura incense rolled by artisans in Bali.</li>
            </ul>
          </div>
          <div className="space-y-6">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.author} className="rounded-3xl bg-brand-light p-6">
                <blockquote className="text-lg font-medium">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-4 text-sm uppercase tracking-wide">
                  {testimonial.author}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="journal" className="rounded-[32px] bg-brand-dark p-10 text-white">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Journal</p>
              <h2 className="mt-4 text-3xl font-display">Meditations on commerce & craft</h2>
              <p className="mt-4 text-white/80">
                This demo ships with a Node/Express API and a React + Tailwind storefront. Swap the
                static data for your MedusaJS backend, or connect to a database like MySQL when you’re
                ready for persistence.
              </p>
              <p
                className={`mt-4 text-sm ${
                  checkoutError ? 'text-red-300' : 'text-white/70'
                }`}
              >
                {checkoutMessage ||
                  checkoutError ||
                  'Cart interactions happen client-side for speedier prototyping.'}
              </p>
            </div>
            <div className="space-y-6">
              <article className="rounded-3xl bg-white/10 p-6">
                <h3 className="text-xl font-display">Stack overview</h3>
                <p className="mt-2 text-white/80">
                  • Node/Express API powering products and checkout preview
                  <br />• React storefront built with Vite and Tailwind
                  <br />• Headless UI components for smooth micro-interactions
                </p>
              </article>
              <article className="rounded-3xl bg-white/10 p-6">
                <h3 className="text-xl font-display">Next steps</h3>
                <p className="mt-2 text-white/80">
                  Configure a Medusa server, hook up real carts, and connect a payment provider to take
                  this prototype into production.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onCheckout={handleCheckout}
        checkoutDisabled={cartItems.length === 0 || isCheckoutProcessing}
        checkoutProcessing={isCheckoutProcessing}
      />
    </div>
  );
}
