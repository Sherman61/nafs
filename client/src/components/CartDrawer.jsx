import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function CartDrawer({
  open,
  onClose,
  items,
  onCheckout,
  checkoutDisabled = false,
  checkoutProcessing = false
}) {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="w-screen max-w-md bg-white shadow-xl">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b px-6 py-4">
                    <Dialog.Title className="text-lg font-semibold">Your Cart</Dialog.Title>
                    <button onClick={onClose}>
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="flex-1 space-y-4 overflow-y-auto p-6">
                    {items.length === 0 && <p className="text-sm text-brand-dark/70">No items yet.</p>}
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.media}
                          alt={item.name}
                          className="h-16 w-16 rounded-lg object-cover"
                          loading="lazy"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-brand-dark/70">Qty {item.quantity}</p>
                        </div>
                        <p className="font-display text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t px-6 py-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={onCheckout}
                      disabled={checkoutDisabled}
                      className={`mt-4 w-full rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition
                        ${checkoutDisabled ? 'bg-brand-dark/40 cursor-not-allowed' : 'bg-brand-dark hover:bg-brand-dark/90'}`}
                    >
                      {checkoutProcessing ? 'Processing…' : 'Checkout'}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
