import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import ProductCard from '../components/ProductCard.jsx';
import CartDrawer from '../components/CartDrawer.jsx';
import CategoryPills from '../components/CategoryPills.jsx';
import { useStorefrontData } from '../hooks/useStorefrontData.js';

const CART_STORAGE_KEY = 'lefanek-ahava-cart';
const testimonials = [
  {
    quote: 'The Ahava tees drape perfectly and still feel respectful enough for Friday errands.',
    author: 'Noam, Brooklyn printmaker'
  },
  {
    quote: 'Customers love spotting the Hebrew lettering peeking out from blazers during meetings.',
    author: 'Gali, boutique owner'
  }
];

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

export default function Storefront({ navigate }) {
  const {
    categories,
    products,
    loading,
    error,
    filterProductsByCategory,
    usedFallback
  } = useStorefrontData();
  const [activeCategory, setActiveCategory] = useState(null);
  const [cartItems, setCartItems] = useState(() => getStoredCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const checkoutMessage = 'Cart interactions now persist locally so your fittings stay in sync across tabs.';

  useEffect(() => {
    persistCart(cartItems);
  }, [cartItems]);

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

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (navigate) {
      navigate('/checkout');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/checkout';
    }
  };

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark">
      <Header onCartToggle={() => setIsCartOpen(true)} onNavigate={navigate} />
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-12">
        <section className="hero-bg overflow-hidden rounded-[40px] bg-brand-dark text-white">
          <div className="space-y-6 p-12 md:p-20">
            <p className="text-sm uppercase tracking-[0.4em] text-white/80">Lefanek Ahava</p>
            <h1 className="text-4xl font-display leading-tight md:text-6xl">
              T-shirts and Jewish layers for everyday mitzvot moments.
            </h1>
            <p className="max-w-2xl text-lg text-white/80">
              Super-soft tees, tallit-inspired wraps, and kippot designed to feel at home from the subway to candle lighting.
              Powered by a Node + React stack so you can remix the experience quickly.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-full bg-white px-6 py-3 text-brand-dark">Shop the drop</button>
              <button className="rounded-full border border-white/70 px-6 py-3 text-white">
                Learn the story
              </button>
            </div>
          </div>
        </section>

        <section id="collections" className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-dark/60">Collections</p>
              <h2 className="text-3xl font-display">Wear your blessings</h2>
            </div>
            <CategoryPills
              categories={categories}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>
          {loading && <p>Loading curated goods…</p>}
          {usedFallback && (
            <p className="rounded-3xl border border-amber-500/40 bg-amber-50 p-4 text-sm text-amber-900">
              Live inventory is offline, so we are showcasing the Lefanek Ahava lookbook stored in the app bundle.
            </p>
          )}
          {!usedFallback && error && <p className="text-red-700">Failed to load data.</p>}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </section>

        <section id="bestsellers" className="grid gap-8 rounded-[32px] bg-white p-10 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-dark/60">Bestsellers</p>
            <h2 className="mt-2 text-3xl font-display">Loved across the diaspora</h2>
            <p className="mt-4 text-brand-dark/80">
              Micro-batched drops keep fabric quality high and let us highlight new Hebrew lettering each season.
              Customers style the pieces for studio days, campus, and synagogue alike.
            </p>
            <ul className="mt-6 space-y-4 text-sm">
              <li>• Signature tees knit from breathable organic cotton milled in Tel Aviv.</li>
              <li>• Wraps finished with hand-tied tzitzit fringe by Safed artisans.</li>
              <li>• Velvet kippot lined with satin so they stay comfortable all night.</li>
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
              <h2 className="mt-4 text-3xl font-display">Heritage meets modern dev</h2>
              <p className="mt-4 text-white/80">
                Lefanek Ahava is prototyped with a Node/Express API plus a React + Tailwind storefront.
                Swap the seed data for your commerce backend or a database when you are ready to persist every SKU.
              </p>
              <p className="mt-4 text-sm text-white/70">
                {checkoutMessage || 'Cart interactions happen client-side for speedier prototyping.'}
              </p>
            </div>
            <div className="space-y-6">
              <article className="rounded-3xl bg-white/10 p-6">
                <h3 className="text-xl font-display">Stack overview</h3>
                <p className="mt-2 text-white/80">
                  • Node/Express API powering catalog + cart preview
                  <br />• React storefront built with Vite and Tailwind
                  <br />• Headless UI components for smooth micro-interactions
                </p>
              </article>
              <article className="rounded-3xl bg-white/10 p-6">
                <h3 className="text-xl font-display">Next steps</h3>
                <p className="mt-2 text-white/80">
                  Connect your preferred commerce backend, wire checkout to a payment provider, and keep
                  seeding apparel drops straight from Lefanek Ahava’s dashboard.
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
        checkoutDisabled={cartItems.length === 0}
      />
    </div>
  );
}
