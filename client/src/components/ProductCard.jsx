import { useMemo } from 'react';

export default function ProductCard({ product, onAddToCart }) {
  const priceLabel = useMemo(() => `$${product.price.toFixed(2)}`, [product.price]);

  return (
    <article className="card-shadow flex flex-col overflow-hidden rounded-3xl bg-white">
      <div className="relative">
        <img src={product.media} alt={product.name} className="h-60 w-full object-cover" loading="lazy" />
        <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold">
          {product.categoryLabel ?? product.categoryId.replace('cat-', '')}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="mt-1 text-sm text-brand-dark/70">{product.shortDescription}</p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <p className="text-xl font-display">{priceLabel}</p>
          <button
            onClick={() => onAddToCart(product)}
            className="rounded-full border border-brand-dark px-4 py-2 text-sm font-semibold transition hover:bg-brand-dark hover:text-white"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
