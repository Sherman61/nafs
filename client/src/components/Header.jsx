import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Rituals', href: '#collections' },
  { name: 'Bestsellers', href: '#bestsellers' },
  { name: 'Journal', href: '#journal' }
];

export default function Header({ onCartToggle }) {
  return (
    <header className="sticky top-0 z-20 bg-brand-light/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="text-2xl font-display tracking-wide">medusah.</div>
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          {navigation.map((item) => (
            <a key={item.name} className="hover:text-brand-dark/70" href={item.href}>
              {item.name}
            </a>
          ))}
        </nav>
        <button
          onClick={onCartToggle}
          className="inline-flex items-center gap-2 rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-semibold"
        >
          <ShoppingBagIcon className="h-5 w-5" />
          Cart
        </button>
      </div>
    </header>
  );
}
