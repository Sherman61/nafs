import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { useStorefrontData } from '../hooks/useStorefrontData.js';

const defaultForm = {
  name: '',
  price: '',
  description: '',
  media: '',
  highlight: ''
};

const mapProductToForm = (product) =>
  product
    ? {
        name: product.name || '',
        price: product.price?.toString() || '',
        description: product.description || '',
        media: product.media || '',
        highlight: product.highlight || ''
      }
    : { ...defaultForm };

export default function ProductEdit({ navigate }) {
  const { products, loading, error } = useStorefrontData();
  const [selectedId, setSelectedId] = useState('');
  const [formData, setFormData] = useState(defaultForm);
  const [feedback, setFeedback] = useState(null);

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === selectedId),
    [products, selectedId]
  );

  useEffect(() => {
    setFormData(mapProductToForm(selectedProduct));
  }, [selectedProduct]);

  const handleSelectChange = (event) => {
    setSelectedId(event.target.value);
    setFeedback(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedId) {
      setFeedback({ type: 'error', message: 'Select a product to edit from the catalog.' });
      return;
    }
    if (!formData.name || !formData.price) {
      setFeedback({ type: 'error', message: 'Name and price are required.' });
      return;
    }

    setFeedback({
      type: 'success',
      message:
        'Updates staged locally. Wire this form to your Medusa admin API to persist the changes.'
    });
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
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-dark/60">Admin</p>
            <h1 className="text-4xl font-display">Edit catalog product</h1>
            <p className="mt-2 text-brand-dark/70">
              Mirror how a Medusa admin workflow might look when tweaking pricing, imagery, or copy for
              existing ritual goods.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleNavigate('/admin')}
              className="rounded-full border border-brand-dark/20 px-5 py-2 text-sm font-semibold"
            >
              ⬅ Back to dashboard
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('/')}
              className="rounded-full border border-brand-dark/20 px-5 py-2 text-sm font-semibold"
            >
              Visit storefront
            </button>
          </div>
        </header>

        <section className="grid gap-8 rounded-[32px] bg-white p-6 shadow-sm md:grid-cols-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold" htmlFor="product">
                Select product
              </label>
              <select
                id="product"
                value={selectedId}
                onChange={handleSelectChange}
                className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
              >
                <option value="">Choose an item…</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold" htmlFor="name">
                Product name*
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleFormChange}
                className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold" htmlFor="price">
                  Price (USD)*
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-semibold" htmlFor="highlight">
                  Highlight line
                </label>
                <input
                  id="highlight"
                  name="highlight"
                  type="text"
                  value={formData.highlight}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
                  placeholder="Star ingredients, rituals, etc."
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleFormChange}
                className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
                placeholder="Describe the story behind this item"
              />
            </div>

            <div>
              <label className="text-sm font-semibold" htmlFor="media">
                Media URL
              </label>
              <input
                id="media"
                name="media"
                type="url"
                value={formData.media}
                onChange={handleFormChange}
                className="mt-1 w-full rounded-2xl border border-brand-dark/20 px-4 py-2"
                placeholder="https://"
              />
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
              className="w-full rounded-full bg-brand-dark px-6 py-3 text-white transition hover:bg-brand-dark/80"
              disabled={loading}
            >
              Save edits
            </button>
          </form>

          <div className="space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-dark/60">Live preview</p>
              <h2 className="text-2xl font-display">See your updates</h2>
              <p className="mt-2 text-sm text-brand-dark/70">
                {selectedProduct
                  ? 'Preview pulls in the latest form values so merchandisers can quickly iterate.'
                  : 'Select a product from the dropdown to start editing.'}
              </p>
            </div>
            <div className="rounded-3xl border border-brand-dark/10 p-4">
              {loading && <p>Loading catalog…</p>}
              {error && <p className="text-red-700">Failed to fetch products.</p>}
              {!loading && !selectedProduct && <p className="text-brand-dark/70">No product selected.</p>}
              {selectedProduct && (
                <ProductCard
                  product={{
                    ...selectedProduct,
                    ...formData,
                    price: Number(formData.price || selectedProduct.price || 0)
                  }}
                  onAddToCart={() => {}}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
