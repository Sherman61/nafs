export default function CategoryPills({ categories, activeCategory, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full border px-4 py-2 text-sm font-medium ${
          activeCategory === null
            ? 'bg-brand-dark text-white'
            : 'border-brand-dark/30 text-brand-dark'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            activeCategory === category.id
              ? 'bg-brand-dark text-white'
              : 'border-brand-dark/30 text-brand-dark'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
