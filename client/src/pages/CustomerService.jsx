import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

const supportChannels = [
  {
    title: 'Email support',
    description: 'Get a response within one business day from our small team in Brooklyn.',
    icon: EnvelopeIcon,
    action: 'support@lefanek-ahava.com'
  },
  {
    title: 'Call or text',
    description: 'Weekdays from 9am–6pm ET. Perfect for rush orders or sizing help.',
    icon: PhoneIcon,
    action: '+1 (718) 555-0193'
  }
];

const policyHighlights = [
  {
    label: 'Shipping & carriers',
    copy:
      'The checkout flow is wired for shipping choices today. Swap in your preferred carrier API (Shippo, EasyPost, or a custom logistics service) where shippingMethod is set inside checkout to quote rates and print labels.'
  },
  {
    label: 'Payments',
    copy:
      'Plug in your payment provider (Stripe, Adyen, PayPal, etc.) in the checkout form submission. That keeps card, wallet, or ACH support in a single place while preserving the current order summary UI.'
  },
  {
    label: 'Returns & exchanges',
    copy:
      'Eligible within 30 days if unworn. Create a return label with your shipping provider and we will process refunds to the original payment method once items are inspected.'
  }
];

export default function CustomerService({ navigate }) {
  const handleNavigate = (path) => {
    if (navigate) {
      navigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  return (
    <div className="min-h-screen bg-brand-light px-4 py-10 text-brand-dark">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-dark/60">Support</p>
            <h1 className="text-4xl font-display">Customer service hub</h1>
            <p className="mt-2 max-w-2xl text-brand-dark/70">
              Reach the Lefanek Ahava team, review policies, and see where to connect your own shipping
              and payment providers in the app.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleNavigate('/')}
              className="rounded-full border border-brand-dark/20 px-5 py-2 text-sm font-semibold"
            >
              ⬅ Back to storefront
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('/checkout')}
              className="rounded-full border border-brand-dark/20 px-5 py-2 text-sm font-semibold"
            >
              Review checkout
            </button>
          </div>
        </header>

        <section className="grid gap-6 rounded-[32px] bg-white p-6 shadow-sm md:grid-cols-2">
          {supportChannels.map((channel) => (
            <article key={channel.title} className="flex gap-4 rounded-3xl border border-brand-dark/10 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand-dark">
                <channel.icon className="h-6 w-6" aria-hidden />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{channel.title}</h2>
                <p className="text-sm text-brand-dark/70">{channel.description}</p>
                <p className="text-sm font-medium">{channel.action}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="space-y-6 rounded-[32px] bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-dark/60">Policies</p>
            <h2 className="text-2xl font-display">Shipping, payments, and returns</h2>
            <p className="text-brand-dark/70">
              Use these notes as a blueprint for wiring the prototype to your commerce stack. Each item points
              to the exact place in the checkout experience where you can drop in provider SDKs or API calls.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {policyHighlights.map((policy) => (
              <article key={policy.label} className="rounded-3xl border border-brand-dark/10 p-4">
                <h3 className="text-lg font-semibold">{policy.label}</h3>
                <p className="mt-2 text-sm text-brand-dark/70">{policy.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] bg-brand-dark p-8 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Need a hand?</p>
              <h2 className="text-2xl font-display">We reply within one business day</h2>
              <p className="text-white/80">
                Share your order number, item name, and the issue you are seeing so we can keep your wrap or tee in
                rotation.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleNavigate('/checkout')}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-dark"
            >
              Go to checkout
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
